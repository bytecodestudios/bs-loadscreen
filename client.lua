local hasLoaded = false
AddEventHandler("playerSpawned", function()
    if not hasLoaded then
        ShutdownLoadingScreen()
        ShutdownLoadingScreenNui()
        SendNUIMessage({
            action = 'TOGGLE',
            data = false
        })
        hasLoaded = true
    end
end)
