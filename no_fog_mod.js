/*
	Name : No Fog Mod
	Author : TDStuart
	Description : Removes fog but keeps signal repeater's function.
	Website : https://github.com/TristonStuart/No-Fog-Mod-Yorg3
	Download : https://github.com/TristonStuart/No-Fog-Mod-Yorg3/blob/master/no_fog_mod.js
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

    // Funtion to get root variable
    function BZS(root){
        // Use api.patchMethodReplaceLogic to replace original zombie spawning function
        api.patchMethodReplaceLogic(root.waveMgr, "findSpawnPoint", function() {
            // Zombie Spawning Function (all code excepted marked is original)
            const basePos = this.root.logic.getLocalPlayerBase().getTile();
            let maxTries = 5;
            while (maxTries-- > 0) {
                // First, find a random tile
                const startTile = this.getRandomBorderTile();
                const tileToBase = startTile
                .direction(basePos)
                .normalize()
                ._ds(2);
                let currentTile = startTile;
                let maxSteps = 399;
                while (maxSteps-- > 0) {
                    let newTile = currentTile.add(tileToBase);
                    
                    // Changed to checkIsExploredByFaction since we can't rely on the smoke
                    if (this.root.logic.checkIsExploredByFaction(newTile.round(), this.root.playerFaction)) {
                        // We step back 5 tiles
                        var cTileHold = currentTile.sub(tileToBase._ms(5));
                        // Checks if new tile would be a valid tile, if not, don't step back 5 tiles
                        if (cTileHold.x >= 0 && cTileHold.y >= 0 && cTileHold.x < api.gameConfig.numTilesX && cTileHold.y < api.gameConfig.numTilesY){
                            return cTileHold.toWorldSpace();
                        }else {
                            return currentTile.toWorldSpace();
                        }
                    }
                    currentTile = newTile;
                }
            }

            console.warn(this, "Failed to find raymarched spawn point, using fallback");
            return this.findSpawnPointFallback();
        });
    }
    
    // Register the BZS function
    api.registerModImplementation(BZS);
}
window.registerMod(NoFogMod);
