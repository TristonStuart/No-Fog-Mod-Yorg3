/*
	Name : No Fog Mod
	Author : TDStuart
	Description : Removes fog but keeps signal repeaters funtion.
	Website : https://github.com/TristonStuart/No-Fog-Mod-Yorg3
	Download : https://github.com/TristonStuart/No-Fog-Mod-Yorg3
	Version : 1.0.0
*/
function NoFogMod(api) {
		console.log(';) No Fog Mod By TDStuart Loaded!');
    function ModImplementation(root) {
				root.systemMgr.systems.fog.draw = () => {};
				const fog = root.systemMgr.systems.fog;
				const originalUpdate = fog.recomputeFogCache;
				root.systemMgr.systems.fog.recomputeFogCache = function() {
					originalUpdate.apply(fog, arguments);
					for (var i in root.systemMgr.systems.fog.tileVisionState){
						for (var j in root.systemMgr.systems.fog.tileVisionState[i]){
							root.systemMgr.systems.fog.tileVisionState[i][j] = true
						}
					}
				}
				root.signals.postLoadHook.add(() => {
					for (var i in root.systemMgr.systems.fog.tileVisionState){
						for (var j in root.systemMgr.systems.fog.tileVisionState[i]){
							root.systemMgr.systems.fog.tileVisionState[i][j] = true
						}
					}
				});
    }
    api.registerModImplementation(ModImplementation);
}
window.registerMod(NoFogMod);