"""Render AI-authored lessons as narrated MP4 slides with caption tracks.
Requires ffmpeg with the flite filter, ffprobe, and Pillow. No paid AI service.
Pass the JSON export of shared/courses.ts and an output directory.
"""
import json,sys,subprocess,tempfile,textwrap,os,re
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
lessons=json.load(open(sys.argv[1]));output=Path(sys.argv[2]);output.mkdir(parents=True,exist_ok=True)
fontroot='/usr/share/fonts/truetype/dejavu/'
def font(size,bold=False):return ImageFont.truetype(fontroot+('DejaVuSans-Bold.ttf' if bold else 'DejaVuSans.ttf'),size)
def run(args):subprocess.run(args,check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
def stamp(t):
    ms=round(t*1000);h,ms=divmod(ms,3600000);m,ms=divmod(ms,60000);s,ms=divmod(ms,1000)
    return f'{h:02}:{m:02}:{s:02}.{ms:03}'
def render(lesson):
    with tempfile.TemporaryDirectory(prefix='skb-video-') as temp:
        temp=Path(temp);parts=[];captions=['WEBVTT\n'];cursor=0
        for i,slide in enumerate(lesson['slides']):
            frame=Image.new('RGB',(1280,720),'#172a30');d=ImageDraw.Draw(frame)
            d.rectangle((0,0,1280,8),fill='#f47a61');d.text((65,48),'SKB DEBATE  /  FREE VIDEO LESSON',font=font(19,True),fill='#94b5aa')
            titlelines=textwrap.wrap(slide['title'],width=37);y=137
            for line in titlelines:d.text((65,y),line,font=font(48,True),fill='#ffffff');y+=64
            y=max(y+50,330)
            for j,point in enumerate(slide['points']):
                d.rounded_rectangle((65,y+5,104,y+44),radius=7,fill='#f47a61');d.text((77,y+10),str(j+1),font=font(20,True),fill='#172a30')
                lines=textwrap.wrap(point,width=65)
                for line in lines:d.text((124,y+6),line,font=font(29),fill='#d9e8e3');y+=41
                y+=26
            d.line((65,638,1215,638),fill='#385559',width=2);d.text((65,663),lesson['format'].upper()+'  ·  AI-AUTHORED / SYNTHESIZED VOICE',font=font(16),fill='#94b5aa');d.text((1125,660),f'{i+1} / 3',font=font(20,True),fill='#f47a61')
            image=temp/f'{i}.png';frame.save(image)
            if i==0:frame.save(output/(lesson['id']+'.jpg'),quality=88)
            narration=temp/f'{i}.txt';narration.write_text(slide['narration'])
            audio=temp/f'{i}.wav';run(['ffmpeg','-y','-f','lavfi','-i',f'flite=textfile={narration}:voice=slt','-af','apad=pad_dur=1.2',str(audio)])
            duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(audio)]))
            sentences=[s.strip() for s in re.split(r'(?<=[.!?])\s+',slide['narration']) if s.strip()]
            weights=[len(s) for s in sentences];total=sum(weights);active=duration-1.2;pos=cursor
            for sentence,weight in zip(sentences,weights):
                end=pos+active*weight/total;captions.append(f'{stamp(pos)} --> {stamp(end)}\n'+ '\n'.join(textwrap.wrap(sentence,85))+'\n');pos=end
            part=temp/f'{i}.mp4';run(['ffmpeg','-y','-loop','1','-framerate','5','-i',str(image),'-i',str(audio),'-c:v','libx264','-preset','veryfast','-crf','27','-pix_fmt','yuv420p','-c:a','aac','-b:a','96k','-shortest','-t',str(duration),'-movflags','+faststart',str(part)])
            parts.append(part);cursor+=duration
        listing=temp/'concat.txt';listing.write_text('\n'.join(f"file '{p}'" for p in parts))
        run(['ffmpeg','-y','-f','concat','-safe','0','-i',str(listing),'-c','copy','-movflags','+faststart',str(output/(lesson['id']+'.mp4'))])
        (output/(lesson['id']+'.vtt')).write_text('\n'.join(captions))
        print(f"{lesson['id']}: {cursor:.1f}s",flush=True)
from concurrent.futures import ThreadPoolExecutor
with ThreadPoolExecutor(max_workers=2) as pool:list(pool.map(render,lessons))
