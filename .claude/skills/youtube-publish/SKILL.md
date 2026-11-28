---
name: youtube-publish
description: Upload one finished video to the YouTube channel of its language, with title, description, playlist and subtitle files, through the user's Chrome. Use when the user asks to publish or upload a video to YouTube. Example - /youtube-publish apps/ganit/video/out/b05c01-hi.mp4
---

# youtube-publish

Input: a video file and its language code. For a ganit video, the rest comes from its files:
- title, description, playlist, made for kids: the `youtube` block of `apps/ganit/video/public/<chapter>/<lang>/script.json`
- subtitles: the `.srt` files beside the mp4
For any other video, ask the user for the title, description, playlist and audience.

Output: the video on YouTube as **private**, and its link.

It works through the Chrome connector, in the user's own logged-in Chrome. No password, key or token is stored or typed.

## Rules

- Uploading is a public act. Before the upload, show the user the full list: file, channel, title, description, playlist, audience, visibility, subtitle files. Upload only after a clear yes in this chat, for this video.
- Visibility is private. Change it to unlisted or public only when the user says so in this chat, for this video.
- One channel for each language. The channel of a language is the `channel` field of that language in `languages.yaml` in the root of the repo. If the field is not there, ask the user which channel it is, and write it in the file after the user answers.
- Never type a password and never pass a sign-in page. If YouTube asks to sign in or to verify, stop and tell the user.
- If the page does not behave as written here after two tries, stop and tell the user what you saw.

## Steps

1. **Collect** the inputs and show the list to the user. Wait for the yes.
2. **Open** `https://www.youtube.com/channel_switcher` and click the channel of this language. Then open `https://studio.youtube.com`. Check that the name under "Your channel" is right. If the right channel is not in the list, stop. Write the channel id from the address into `channel_id` in `languages.yaml` if it is not there.
3. **Upload.** Click the upload arrow at the top right of the dashboard. Find the hidden file input of the "Upload videos" window and give the mp4 to it with the upload tool. Do not click "Select files": it opens a window that cannot be seen.
   - The upload tool takes files under 10 MB. For a bigger file, make a smaller copy first: `ffmpeg -i in.mp4 -c:v libx264 -preset veryslow -crf 23 -c:a copy -movflags +faststart out/<name>.upload.mp4`. Raise `-crf` a little if it is still over 10 MB. Delete the copy after the upload. If it cannot go under 10 MB, ask the user to drag the file into the upload window, and go on from the next step.
   - The copy must be inside the product folder. The upload tool refuses other folders.
4. **Details.** Fill the title and the description. Set the audience: "Yes, it's made for kids" or "No". Pick the playlist. If it is not there, make it with "Create playlist", "New playlist": visibility "Private", order "Manually sorted".
5. **Visibility.** Click "Visibility" at the top of the window. Choose "Private". Save.
6. **Language and subtitles.** Open `https://studio.youtube.com/video/<video id>/translations`.
   - The first time, the page asks for the language of the video. Choose it and confirm.
   - YouTube may have made automatic subtitles in the language of the video. Move the mouse over that row, click the pencil, and accept "Overwrite track". In the editor, open the three dots, then "Upload file".
   - For English: "Add language", "English", then the pencil in its row, then "Upload file".
   - In the "With timing" window, do not click "Continue". Give the `.srt` to the hidden file input of that window with the upload tool. Then click "Publish".
7. **Report.** Give the user the link of the video, the channel, the playlist and what is still to be done.

The size of the Chrome window can change in the middle of the work. Take a new screenshot before clicking by position.

## Improve the method

YouTube changes its pages. When a step here is found wrong, correct this file.

These steps were used on 2026-11-23 for `b05c01-hi.mp4` and on 2026-11-24 for `b05c02` to `b05c08` in Hindi.

Found on 2026-11-24, for many videos in one go:
- Upload all the videos first, then do the subtitles. By then YouTube has made its automatic track for each video.
- The upload tool counts 10 MB as about 10,000,000 bytes on disk. A copy of 9.95 MB went through. A copy of 10.5 MB did not.
- The upload tool works inside one batch of browser steps. Only the hidden file input must be found again for each new window.
- In the details window, scroll to the bottom. Then the audience choice and the playlist box are always at the same place.
- When the channel default language is set, the page does not ask for the language of the video.
- After the Hindi track is published, the "Add language" button moves one row down.
- The address of the playlists page is `https://studio.youtube.com/channel/<channel id>/content/playlists`.

## Making a new channel

Open `https://www.youtube.com/channel_switcher`, click "Create a channel", type the name, then clear the handle field and type the handle. Wait for the green tick before "Create channel". The new channel can take some seconds to show in the list. If the handle shows as taken on a second try, the first try worked.
