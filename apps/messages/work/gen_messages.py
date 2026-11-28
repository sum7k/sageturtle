import sys, os
OUT = sys.argv[1]

NAVY, SKY, GOLD, WHITE = '#14174a', '#eaf4ff', '#ffc531', '#ffffff'
CREAM, PEACH, MINT, LILAC = '#fff0bf', '#ffe3dc', '#ddf3e4', '#e9e4ff'

P = dict(
 person='M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4.500 20a7.500 7.500 0 0 1 15 0',
 back='M15 5l-7 7 7 7',
 home='M4 11l8-7 8 7 M6 10v10h12V10',
 speaker='M4 10v4h3l5 4V6L7 10H4z M16 9a4 4 0 0 1 0 6 M18.5 6.5a8 8 0 0 1 0 11',
 mic='M12 3a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z M6 11a6 6 0 0 0 12 0 M12 17v4',
 video='M3 7h12v10H3z M15 10.500l6-3v9l-6-3',
 eye='M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
 board='M4 5h16v11H4z M9 20l3-4 3 4 M8 9h8 M8 12h5',
 clock='M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 3',
 handset='M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
 whatsapp='M12 3a9 9 0 0 0-7.800 13.500L3 21l4.700-1.200A9 9 0 1 0 12 3z M9 8.500c0 3 2.500 6 6 6.500l1-1.500-2-1-1 .800c-1-.500-1.800-1.300-2.300-2.300l.800-1-1-2z',
 telegram='M21 4L3 11l6 2 2 6 3-4 4 3 3-14z M9 13l8-6',
 sms='M4 5h16v11H9l-5 4V5z M8 9h8 M8 12h5',
 play='M8 5l11 7-11 7V5z',
 flag='M5 21V4 M5 4h12l-2 4 2 4H5',
 smile='M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M8.500 14a4 4 0 0 0 7 0 M9 9.500v.500 M15 9.500v.500',
 star='M12 3l2.700 5.700 6.300.800-4.600 4.300 1.200 6.200L12 17l-5.600 3 1.200-6.200L3 9.500l6.300-.800L12 3z',
 keys='M3 6h18v12H3z M7 10h.500 M11 10h.500 M15 10h.500 M7 14h10',
 camera='M4 8h3l2-2h6l2 2h3v11H4z M12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
 plus='M12 5v14 M5 12h14',
 cross='M6 6l12 12 M18 6L6 18',
 tick='M5 12.500l4.500 4.500L19 7.500',
 horn='M4 10v4h3l8 4V6L7 10H4z M18 9v6',
 arrow='M5 12h14 M13 6l6 6-6 6',
 family='M4 11l8-7 8 7 M6 10v10h12V10 M12 17s-3-2-3-4a1.500 1.500 0 0 1 3-.800 1.500 1.500 0 0 1 3 .800c0 2-3 4-3 4z',
 friends='M8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M16 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M2 19a6 6 0 0 1 12 0 M15 14.500a6 6 0 0 1 7 4.500',
 work='M4 8h16v11H4z M9 8V5h6v3 M4 13h16',
 trade='M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M9 8h6 M9 11h6 M9 8h1.500a3 3 0 0 1 0 6H9l4 3.500',
 neighbours='M3 20v-9l5-4 5 4v9z M13 13l4-3 4 3v7h-8',
 ear='M7 15a6 6 0 1 1 11-4c0 3-3 3-3 6a3 3 0 0 1-5 2 M10 11a2.500 2.500 0 0 1 5 0',
 wave='M3 10v4 M7 7v10 M11 4v16 M15 8v8 M19 6v12 M23 10v4 M27 5v14 M31 8v8 M35 10v4 M39 6v12 M43 9v6 M47 7v10 M51 10v4 M55 8v8',
)

def svg(name, size=22, sw=2, stroke=NAVY, label=None, vb='0 0 24 24', w=None):
    a = f'role="img" aria-label="{label}"' if label else 'aria-hidden="true"'
    width = w if w else size
    return (f'<svg {a} viewBox="{vb}" style="width: {width}px; height: {size}px; fill: none; stroke: {stroke}; '
            f'stroke-width: {sw}; stroke-linecap: round; stroke-linejoin: round"><path d="{P[name]}"></path></svg>')

def round_btn(icon, label, size=44, bg=WHITE, isz=None, href=None, sw=2, stroke=NAVY, extra=''):
    isz = isz or int(size * 0.5)
    st = (f'display: flex; align-items: center; justify-content: center; width: {size}px; height: {size}px; '
          f'flex-shrink: 0; padding: 0; border: 0; border-radius: 999px; background: {bg}{extra}')
    inner = svg(icon, isz, sw, stroke)
    if href:
        return f'<a href="{href}" aria-label="{label}" style="{st}">{inner}</a>'
    return f'<button type="button" aria-label="{label}" style="{st}">{inner}</button>'

def face(size=48, bg=CREAM, badge=None, dot=None):
    b = ''
    if badge:
        b += (f'<span style="position: absolute; right: -4px; bottom: -4px; display: flex; align-items: center; '
              f'justify-content: center; width: 24px; height: 24px; border-radius: 999px; background: {NAVY}">'
              f'{svg(badge, 14, 2, WHITE)}</span>')
    if dot:
        b += (f'<span style="position: absolute; right: -4px; top: -4px; display: flex; align-items: center; '
              f'justify-content: center; min-width: 24px; height: 24px; box-sizing: border-box; padding: 0 6px; '
              f'border-radius: 999px; background: {GOLD}; font-size: 14px; font-weight: 700; color: {NAVY}">{dot}</span>')
    return (f'<span style="position: relative; display: flex; align-items: center; justify-content: center; '
            f'width: {size}px; height: {size}px; flex-shrink: 0; border-radius: 999px; background: {bg}">'
            f'{svg("person", int(size * 0.54))}{b}</span>')

def topbar(left, right):
    return ('<div style="display: flex; align-items: center; justify-content: space-between; gap: 10px">'
            + left + right + '</div>')

def bubble(side, secs, bg, who=None, time=None, big=False, notice=False):
    """A voice note. side: 'l' or 'r'."""
    ps = 56 if big else 44
    border = f'; border: 3px solid {GOLD}' if notice else ''
    play = round_btn('play', 'Play this voice note', ps, GOLD if side == 'l' else WHITE, int(ps * 0.45))
    body = (f'<div style="display: flex; align-items: center; gap: 10px; padding: 10px 14px 10px 10px; '
            f'border-radius: 24px; background: {bg}{border}">{play}'
            f'{svg("wave", 28 if big else 24, 2.5, NAVY, None, "0 0 58 24", 96 if big else 80)}'
            f'<span style="font-size: {18 if big else 15}px; font-weight: 700">{secs}</span></div>')
    meta = ''
    if time:
        meta = f'<span style="font-size: 13px; font-weight: 600; color: #3d4175">{time}</span>'
    col = (f'<div style="display: flex; flex-direction: column; gap: 4px; align-items: '
           f'{"flex-start" if side == "l" else "flex-end"}">')
    if who:
        col += f'<span style="font-size: 13px; font-weight: 700">{who[0]}</span>'
    col += body + meta + '</div>'
    row = (f'<div style="display: flex; align-items: flex-end; gap: 8px; justify-content: '
           f'{"flex-start" if side == "l" else "flex-end"}">')
    if who and side == 'l':
        row += face(36, who[1], who[2] if len(who) > 2 else None)
    return row + col + '</div>'

def sticker(side, icon, bg):
    return (f'<div style="display: flex; justify-content: {"flex-start" if side == "l" else "flex-end"}">'
            f'<span style="display: flex; align-items: center; justify-content: center; width: 88px; height: 88px; '
            f'border-radius: 28px; background: {bg}">{svg(icon, 52, 1.8, NAVY, "A sticker")}</span></div>')

def page(title, body, h=844):
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{title}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link href="https://fonts.googleapis.com/css2?family=Anek+Latin:wght@400;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap" rel="stylesheet">
<style>
body{{margin:0}}
a{{color:#14174a;text-decoration:none}}a:hover{{color:#14174a}}
button{{font-family:inherit;cursor:pointer}}
</style>
</helmet>
<div style="width: 390px; height: {h}px; box-sizing: border-box; padding: 24px; display: flex; flex-direction: column; gap: 16px; overflow: hidden; background: #eaf4ff; color: #14174a; font-family: 'Anek Latin', system-ui, sans-serif">
{body}
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":390,"height":{h}}}}}'>
class Component extends DCLogic {{
renderVals() {{
return {{}};
}}
}}
</script>
</body>
</html>
'''

GROW = '<div style="flex-grow: 1"></div>'
listen = round_btn('speaker', 'Listen', 44, WHITE, 20)

def wide(icon, label, href=None, h=72, isz=32, bg=GOLD):
    st = (f'flex-grow: 1; display: flex; align-items: center; justify-content: center; height: {h}px; padding: 0; '
          f'border: 0; border-radius: 999px; background: {bg}')
    if href:
        return f'<a href="{href}" aria-label="{label}" style="{st}">{svg(icon, isz)}</a>'
    return f'<button type="button" aria-label="{label}" style="{st}">{svg(icon, isz)}</button>'

# ---------------------------------------------------------------- 1. Messages: people and rooms (adult)
def room(href, label, inner, name):
    return (f'<a href="{href}" aria-label="{label}" style="display: flex; flex-direction: column; align-items: center; '
            f'gap: 4px; min-width: 64px">{inner}<span style="font-size: 13px; font-weight: 600; white-space: nowrap">'
            f'{name}</span></a>')

def class_disc(text, dot=None):
    d = ''
    if dot:
        d = (f'<span style="position: absolute; right: -4px; top: -4px; display: flex; align-items: center; '
             f'justify-content: center; min-width: 24px; height: 24px; box-sizing: border-box; padding: 0 6px; '
             f'border-radius: 999px; background: {GOLD}; font-size: 14px; font-weight: 700; color: {NAVY}">{dot}</span>')
    return (f'<span style="position: relative; display: flex; align-items: center; justify-content: center; '
            f'width: 56px; height: 56px; flex-shrink: 0; border-radius: 999px; background: {MINT}">'
            f'{svg("board", 28)}{d}</span>')

rooms = ('<div style="display: flex; gap: 14px; padding: 14px 16px; border-radius: 24px; background: #ffffff">'
         + room('Messages-Child.dc.html', 'My child, 2 new voice notes', face(56, LILAC, None, '2'), '[Child]')
         + room('Class-Parent.dc.html', "My child's class, 1 new notice from the teacher", class_disc('3 A', '1'), '3 A')
         + '</div>')

def chip(icon, label, on=False):
    bg, st = (NAVY, WHITE) if on else (WHITE, NAVY)
    return (f'<button type="button" aria-label="{label}" aria-pressed="{"true" if on else "false"}" '
            f'style="display: flex; align-items: center; justify-content: center; width: 56px; height: 44px; '
            f'flex-shrink: 0; padding: 0; border: 0; border-radius: 999px; background: {bg}">{svg(icon, 22, 2, st)}</button>')

chips = ('<div style="display: flex; align-items: center; justify-content: space-between; gap: 8px">'
         + chip('trade', 'Trade: buyers and sellers', True) + chip('family', 'Family') + chip('friends', 'Friends')
         + chip('work', 'Work: my staff') + chip('neighbours', 'Neighbours') + '</div>')

def person_row(name, bg, app=None):
    marks = {'whatsapp': ('Message in WhatsApp', '#25d366'), 'telegram': ('Message in Telegram', '#8fd0f5'),
             'sms': ('Message by SMS', SKY)}
    btns = ''
    if app:
        btns = round_btn('handset', 'Call on the phone', 44, SKY, 22) + round_btn(app, marks[app][0], 44, marks[app][1], 22)
    return (f'<div style="display: flex; align-items: center; gap: 10px; min-height: 72px; box-sizing: border-box; '
            f'padding: 10px 14px; border-radius: 24px; background: #ffffff">{face(48, bg)}'
            f'<span style="flex-grow: 1; font-size: 18px; font-weight: 700">{name}</span>{btns}</div>')

people = ('<div style="display: flex; flex-direction: column; gap: 10px">'
          + person_row('[Buyer]', CREAM, 'whatsapp') + person_row('[Seed seller]', PEACH, 'sms')
          + person_row('[Customer]', LILAC, 'telegram') + person_row('[Supplier]', MINT, 'whatsapp')
          + person_row('[Customer, no number yet]', CREAM) + '</div>')

messages = page('Messages', '\n'.join([
    topbar(round_btn('home', 'Home', 44, WHITE, 22, 'Home.dc.html'),
           '<span style="flex-grow: 1"></span>' + listen + round_btn('person', 'Me and my family', 44, WHITE, 24, 'Me.dc.html')),
    rooms, chips, people, GROW,
    '<div style="display: flex; align-items: center; gap: 10px">'
    + round_btn('camera', "Scan a person's code to add them", 64, WHITE, 28, 'Me-Friends.dc.html')
    + wide('mic', 'Say a name to call or message') + '</div>',
]))

# ---------------------------------------------------------------- 2. A guardian's chat with a child
def gchip(name, bg, on=False, badge=None):
    ring = f'; box-shadow: 0 0 0 3px {GOLD}' if on else ''
    f = face(48, bg, badge).replace('border-radius: 999px; background: ' + bg, 'border-radius: 999px; background: ' + bg + ring, 1)
    return (f'<button type="button" aria-pressed="{"true" if on else "false"}" style="display: flex; flex-direction: column; '
            f'align-items: center; gap: 6px; min-width: 60px; padding: 0; border: 0; background: transparent; color: {NAVY}">'
            f'{f}<span style="font-size: 13px; font-weight: 600; white-space: nowrap">{name}</span></button>')

child = page('Messages: my child', '\n'.join([
    topbar(round_btn('back', 'Back', 44, WHITE, 22, 'Messages.dc.html', 2.5), listen),
    '<div style="display: flex; align-items: center; gap: 12px">' + face(56, LILAC)
    + '<span style="flex-grow: 1; font-size: 22px; font-weight: 700">[Child&#39;s name]</span>'
    + round_btn('video', 'Call my child inside the app', 48, WHITE, 24) + '</div>',
    '<div style="display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; border-radius: 24px; background: #ffffff">'
    + gchip('[Me]', CREAM, True) + gchip('[Papa]', MINT) + gchip('[Nani]', PEACH) + gchip('[Teacher]', LILAC, False, 'board')
    + '<span style="flex-grow: 1"></span>' + svg('eye', 24, 2, NAVY, "I can see my child's chats with every guardian") + '</div>',
    '<div style="display: flex; flex-direction: column; gap: 12px">'
    + bubble('l', '0:08', WHITE, None, '4:10 PM') + sticker('l', 'star', CREAM)
    + bubble('r', '0:15', CREAM, None, '4:12 PM') + bubble('l', '0:05', WHITE, None, '4:13 PM') + '</div>',
    GROW,
    '<div style="display: flex; align-items: center; gap: 10px">'
    + round_btn('smile', 'Send a sticker', 64, WHITE, 28) + wide('mic', 'Press and speak a voice note')
    + round_btn('keys', 'Type instead', 64, WHITE, 28) + '</div>',
]))

# ---------------------------------------------------------------- 3. The kid: Guardians
def kid_tile(name, bg, dot=None, badge=None, href='Messages-Kid-Chat.dc.html'):
    return (f'<a href="{href}" style="display: flex; flex-direction: column; align-items: center; justify-content: center; '
            f'gap: 10px; height: 176px; border-radius: 28px; background: #ffffff">{face(96, bg, badge, dot)}'
            f'<span style="font-size: 20px; font-weight: 700">{name}</span></a>')

kid = page('Messages: the kid', '\n'.join([
    topbar(round_btn('home', 'Home', 44, WHITE, 22, 'Home.dc.html'), listen),
    '<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px">'
    + kid_tile('[Mummy]', MINT, '2') + kid_tile('[Papa]', CREAM) + kid_tile('[Nani]', PEACH)
    + kid_tile('[Teacher]', LILAC, '1', 'board') + '</div>',
    GROW,
    '<div style="display: flex">' + wide('mic', 'Say who you want to talk to', None, 88, 40) + '</div>',
]))

# ---------------------------------------------------------------- 4. The kid's chat
kidchat = page('Messages: the kid talks to a guardian', '\n'.join([
    topbar(round_btn('back', 'Back', 44, WHITE, 22, 'Messages-Kid.dc.html', 2.5),
           '<span style="flex-grow: 1"></span>' + round_btn('flag', 'Something is wrong. Tell my parent', 44, PEACH, 22) + listen),
    '<div style="display: flex; align-items: center; gap: 12px">' + face(64, MINT)
    + '<span style="flex-grow: 1; font-size: 24px; font-weight: 700">[Mummy]</span></div>',
    '<div style="display: flex; flex-direction: column; gap: 14px">'
    + bubble('r', '0:06', CREAM, None, None, True) + bubble('l', '0:12', WHITE, None, None, True)
    + sticker('r', 'smile', CREAM) + bubble('l', '0:04', WHITE, None, None, True) + '</div>',
    GROW,
    '<div style="display: flex; align-items: center; gap: 10px">'
    + round_btn('smile', 'Send a sticker', 64, WHITE, 30) + wide('mic', 'Press and speak', None, 88, 40)
    + round_btn('video', 'Call inside the app', 64, WHITE, 30) + '</div>',
]))

# ---------------------------------------------------------------- 5. The class chat (teen)
seen = (f'<span style="display: flex; align-items: center; gap: 6px; height: 44px; padding: 0 14px; border-radius: 999px; '
        f'background: #ffffff">{svg("eye", 22, 2, NAVY, "The teacher sees this chat")}{svg("board", 20)}</span>')

classchat = page('Messages: the class chat', '\n'.join([
    topbar(round_btn('back', 'Back', 44, WHITE, 22, 'Class-Teen.dc.html', 2.5),
           '<span style="flex-grow: 1"></span>' + round_btn('flag', 'Report this chat', 44, PEACH, 22) + listen),
    '<div style="display: flex; align-items: center; gap: 12px"><span style="display: flex; align-items: center; '
    'justify-content: center; width: 44px; height: 44px; flex-shrink: 0; border-radius: 999px; background: #ffffff">'
    + svg('board', 24, 2, NAVY, 'My class') + '</span><span style="flex-grow: 1; font-size: 24px; font-weight: 700">9 A</span>'
    + seen + '</div>',
    '<div style="display: flex; flex-direction: column; gap: 12px">'
    + bubble('l', '0:20', WHITE, ('[Teacher]', LILAC, 'board'), '3:05 PM', False, True)
    + bubble('l', '0:07', WHITE, ('[Name]', MINT), '3:20 PM')
    + bubble('r', '0:09', CREAM, None, '3:22 PM')
    + bubble('l', '0:11', WHITE, ('[Name]', PEACH), '3:30 PM') + '</div>',
    GROW,
    '<div style="display: flex; align-items: center; gap: 10px">'
    + round_btn('keys', 'Type instead', 64, WHITE, 28) + wide('mic', 'Press and speak to the class')
    + round_btn('video', 'Join the class call', 64, WHITE, 28) + '</div>',
]))

# ---------------------------------------------------------------- 6. Speak to the class (teacher)
def small_faces(bgs):
    return ''.join(face(36, b) for b in bgs)

def notice_row(day, secs, heard):
    return (f'<div style="display: flex; align-items: center; gap: 10px; min-height: 64px; box-sizing: border-box; '
            f'padding: 8px 14px 8px 10px; border-radius: 24px; background: #ffffff">'
            + round_btn('play', 'Play this notice', 44, SKY, 20)
            + f'<span style="font-size: 17px; font-weight: 700">{day}</span>'
            + f'<span style="flex-grow: 1; font-size: 15px; font-weight: 600; color: #3d4175">{secs}</span>'
            + svg('ear', 22, 2, NAVY, 'Parents who heard it')
            + f'<span style="font-size: 17px; font-weight: 700">{heard}</span></div>')

teacher = page('Messages: speak to the class', '\n'.join([
    topbar(round_btn('back', 'Back', 44, WHITE, 22, 'Class-Teacher.dc.html', 2.5), listen),
    '<div style="display: flex; align-items: center; gap: 10px"><span style="height: 44px; display: flex; align-items: center; '
    'padding: 0 18px; border-radius: 999px; background: #14174a; color: #ffffff; font-size: 18px; font-weight: 700">5 B</span>'
    + svg('arrow', 22, 2.5) + '<span style="display: flex; align-items: center; gap: 4px; padding: 4px 12px 4px 4px; border-radius: 999px; background: #ffffff">'
    + small_faces([MINT, PEACH, LILAC]) + '<span style="font-size: 17px; font-weight: 700; padding-left: 6px">32</span>'
    + svg('family', 22, 2, NAVY, 'It goes to the parents of the class') + '</span></div>',
    '<div style="display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 22px 18px; border-radius: 28px; background: #ffffff">'
    '<span style="display: flex; align-items: center; justify-content: center; width: 132px; height: 132px; border-radius: 999px; background: #fff0bf">'
    '<span style="display: flex; align-items: center; justify-content: center; width: 96px; height: 96px; border-radius: 999px; background: #ffc531">'
    + svg('mic', 44, 2, NAVY, 'Recording') + '</span></span>'
    + svg('wave', 32, 2.5, NAVY, None, '0 0 58 24', 160)
    + '<span style="font-size: 28px; font-weight: 700">0:12</span>'
    '<div style="display: flex; align-items: center; justify-content: space-between; align-self: stretch; gap: 10px">'
    + round_btn('cross', 'Throw it away', 64, SKY, 26, None, 2.5) + round_btn('play', 'Hear it first', 64, SKY, 26)
    + round_btn('tick', 'Send to the class', 72, GOLD, 32, None, 3) + '</div></div>',
    '<div style="display: flex; align-items: center; gap: 14px; min-height: 64px; box-sizing: border-box; padding: 8px 14px; border-radius: 24px; background: #ffffff">'
    '<span style="display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; flex-shrink: 0; border-radius: 999px; background: #eaf4ff">'
    + svg('clock', 24, 2, NAVY, 'Office hours') + '</span><span style="flex-grow: 1; font-size: 18px; font-weight: 700">9 AM to 4 PM</span></div>',
    '<div style="display: flex; flex-direction: column; gap: 10px">' + notice_row('Mon', '0:31', '28 / 32')
    + notice_row('Fri', '0:18', '32 / 32') + '</div>',
]))

files = {'Messages.dc.html': messages, 'Messages-Child.dc.html': child, 'Messages-Kid.dc.html': kid,
         'Messages-Kid-Chat.dc.html': kidchat, 'Messages-Class.dc.html': classchat,
         'Messages-Class-Teacher.dc.html': teacher}
for n, s in files.items():
    with open(os.path.join(OUT, n), 'w') as f:
        f.write(s)
    print(n, len(s))
