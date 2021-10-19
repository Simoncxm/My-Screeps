import { getSources, getStorages, getNeedStorages, getConstructionSites, getRepairableSites, getResources, getStores } from './creepsRoleController';

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

export const harvest = (creep: Creep, index: number): void => {
  const sources = getSources(creep.room);

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
  let needs = getNeedStorages(creep.room);
  if (needs.length === 0) {
    needs = getStorages(creep.room);
  }
  const index = findClosest(creep, needs);

  if (creep.transfer(needs[index], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    creep.moveTo(needs[index], {visualizePathStyle: {stroke: '#ffffff'}});
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

export const pickup = (creep: Creep): void => {
  const resources = getResources(creep.room);
  const index = findClosest(creep, resources);

  if (creep.pickup(resources[index]) === ERR_NOT_IN_RANGE) {
    creep.moveTo(resources[index], {visualizePathStyle: {stroke: '#ffaa00'}});
  }
};

export const withdraw = (creep: Creep): void => {
  const stores = getStores(creep.room);
  const index = findClosest(creep, stores);

  if (creep.withdraw(stores[index], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    creep.moveTo(stores[index], {visualizePathStyle: {stroke: '#ffaa00'}});
  }
};
