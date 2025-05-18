fx_version 'cerulean'
game 'gta5'
lua54 'yes'
fxv2_oal 'yes'

author 'Kartik (Bytecode Studios)'
description 'Loading Screen'
version '0.1'

client_script 'client.lua'

loadscreen 'web/index.html'
loadscreen_manual_shutdown 'yes'
loadscreen_cursor 'yes'

files {
    'web/index.html',
    'web/assets/*',
    'web/config/*',
}
