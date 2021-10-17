import { getSources, getStorages, getConstructionSites, getRepairableSites } from './creepsRoleController';

interface HasPos {
  pos: RoomPosition
}

export const findClosest = (creep: Creep, targets: HasPos[]): number => {
  let minDist = 2147483647;
  let final = -1;
  for (let index = 0; index < targets.length; index++) {
    const dist = creep.room.findPath(creep.pos, targets[index].pos);
    if (dist.length < minDist) {
      minDist = dist.length;
      final = index;
    }
  }
  return final;
};

export const harvest = (creep: Creep): void => {
  const sources = getSources(creep.room);
  const index = findClosest(creep, sources);

  if (creep.harvest(sources[index]) === ERR_NOT_IN_RANGE) {
    creep.moveTo(sources[index], {visualizePathStyle: {stroke: '#ffaa00'}});
  }
};

export const build = (creep: Creep): void => {
  const constructionSites = getConstructionSites(creep.room);
  const index = findClosest(creep, constructionSites);
  
  if (creep.build(constructionSites[index]) === ERR_NOT_IN_RANGE) {
    creep.moveTo(constructionSites[index], { visualizePathStyle: { stroke: '#ffffff' } });
  }
};

export const transfer = (creep: Creep): void => {
  const storages = getStorages(creep.room);
  const index = findClosest(creep, storages);

  if (creep.transfer(storages[index], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    creep.moveTo(storages[index], {visualizePathStyle: {stroke: '#ffffff'}});
  }
};

export const repair = (creep: Creep): void => {
  const repairSites = getRepairableSites(creep.room);
  const index = findClosest(creep, repairSites);

  if (creep.repair(repairSites[index]) === ERR_NOT_IN_RANGE) {
    creep.moveTo(repairSites[index], {visualizePathStyle: {stroke: '#ffffff'}});
  }
};

export const upgrade = (creep: Creep): void => {
  if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
    creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
  }
};
