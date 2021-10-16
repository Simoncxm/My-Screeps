import _ from 'lodash';
import roleBuilder from './modules/role.builder';
import roleHarvester from './modules/role.harvester';
import roleUpgrader from './modules/role.upgrader';

type roles = 'harvester' | 'upgrader' | 'builder';

const roleToDesign = {
  'harvester': [WORK, CARRY, MOVE, MOVE],
  'upgrader': [WORK, CARRY, MOVE, MOVE],
  'builder': [WORK, CARRY, MOVE, MOVE],
};

const findAndBuild = (role: roles, maxLength: number) => {
  const creeps = _.filter(Game.creeps, (creep) => creep.memory.role === role);
  console.log(role + ': ' + creeps.length);

  if (creeps.length < maxLength) {
    const newName = role + Game.time;
    console.log('Spawning new ' + role + ': ' + newName);
    Game.spawns['Spawn1'].spawnCreep(roleToDesign[role], newName, 
      {memory: {role}});
  }
};

export const loop = () => {
  for(const name in Memory.creeps) {
    if(!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log('Clearing non-existing creep memory:', name);
    }
  }

  findAndBuild('harvester', 2);
  findAndBuild('upgrader', 2);
  findAndBuild('builder', 2);

  if(Game.spawns['Spawn1'].spawning) { 
    const spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
    Game.spawns['Spawn1'].room.visual.text(
      '🛠️' + spawningCreep.memory.role,
      Game.spawns['Spawn1'].pos.x + 1, 
      Game.spawns['Spawn1'].pos.y, 
      {align: 'left', opacity: 0.8});
  }

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.role == 'harvester') {
      roleHarvester.run(creep);
    }
    if (creep.memory.role == 'upgrader') {
      roleUpgrader.run(creep);
    }
    if (creep.memory.role == 'builder') {
      roleBuilder.run(creep);
    }
  }
};
