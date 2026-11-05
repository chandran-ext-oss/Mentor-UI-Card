Isha Health Solutions homepage (single option)
Upload the CONTENTS of this folder to the root of a GitHub repo: index.html and the "i" folder must sit side by side.
Vercel: Import repo, Framework preset "Other", no build command, no output directory. Deploy.
Check: /i/hero1.jpg and /i/sadhguru.mp4 should open on your Vercel address.
To set up links, edit the CFG line near the top of the script in index.html:
  mymedic: MyMedic consultation booking URL
  live: set true once the individual pages (/care/<slug>, /systems/<slug>) exist
To use the real Sadhguru film, replace i/sadhguru.mp4 (and i/sadhguru-poster.jpg) keeping the same names.
