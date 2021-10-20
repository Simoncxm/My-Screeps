import _ from 'lodash';

const getMaxCost = Game.spawns['Spawn1'].room.energyCapacityAvailable;

type CreepsDesignDict = {
  [key in Roles]?: Array<BodyPartConstant>;
};

const getCreepsDesign = (): CreepsDesignDict => {
  let res: CreepsDesignDict;
  if (getMaxCost < 550) {
    res = {
      'harvester': [WORK, WORK, CARRY, MOVE],
      'upgrader': [WORK, WORK, CARRY, MOVE],
      'builder': [WORK, WORK, CARRY, MOVE],
    };
  } else if (getMaxCost >= 550) {
    res = {
      'harvester': [WORK, WORK, CARRY, MOVE, MOVE],
      'miner': [WORK, WORK, WORK, WORK, WORK, MOVE],
      'carrier': [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
      'builder': [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
      'upgrader': [WORK, WORK, CARRY, MOVE, MOVE],
      'transferer': [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
      'claimer': [CLAIM, MOVE, MOVE],
    };
  }
  return res;
};

const countAndBuild = (role: Roles, maxLength: number): boolean => {
  const creeps = _.filter(Game.creeps, (creep) => creep.memory.role === role);
  console.log(role + ': ' + creeps.length);

  const roleToDesign = getCreepsDesign();

  if (creeps.length < maxLength) {
    const newName = role + Game.time;
    console.log('Spawning new ' + role + ': ' + newName);
    Game.spawns['Spawn1'].spawnCreep(roleToDesign[role], newName, 
      {memory: {role}});
    return false;
  }
  return true;
};

export default function spawnCreeps(): void {
  // countAndBuild('harvester', 2);
  if (countAndBuild('miner', 2)) {
  if (countAndBuild('carrier', 4)) {
  if (countAndBuild('builder', 4)) {
  if (countAndBuild('upgrader', 4)) {
  if (countAndBuild('transferer', 2)) {
    // countAndBuild('claimer', 1);
  }
  }
  }
  }
  }
}
