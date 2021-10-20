import spawnCreeps from '@/modules/creepSpawnController';
import { runCreep, minerController } from '@/modules/creepsRoleController';
import { roomStructureFinder } from './modules/structureFilter';

export const loop = () => {
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log('Clearing non-existing creep memory:', name);
    }
  }

  const myRoom = Game.rooms['W43N29'];

  const towers = myRoom.find(FIND_STRUCTURES, {
    filter: (s: AnyStructure) => {
      return s.structureType === STRUCTURE_TOWER;
    }
  });
  for (let i = 0; i < towers.length; i++) {
    const tower = towers[i] as StructureTower;
    const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => structure.hits < structure.hitsMax && structure.structureType !== STRUCTURE_WALL
    });
    if(closestDamagedStructure) {
      tower.repair(closestDamagedStructure);
    }

    const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(closestHostile) {
      tower.attack(closestHostile);
    }
  }

  spawnCreeps();

  if (Game.spawns['Spawn1'].spawning) { 
    const spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
    Game.spawns['Spawn1'].room.visual.text(
      '🛠️' + spawningCreep.memory.role,
      Game.spawns['Spawn1'].pos.x + 1, 
      Game.spawns['Spawn1'].pos.y, 
      {align: 'left', opacity: 0.8});
  }

  roomStructureFinder.update(myRoom);

  minerController.index = 0;
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    runCreep(creep);
  }
};
