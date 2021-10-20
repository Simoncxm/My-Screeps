import { needStoragesFilter, otherStoragesFilter, hasEnergyStoragesFilter, needRepairFilter, roomStructureFinder } from './structureFilter';

export const harvest = (creep: Creep, index: number): void => {
  const sources = roomStructureFinder.sources;

  if (creep.harvest(sources[index]) === ERR_NOT_IN_RANGE) {
    creep.moveTo(sources[index], {visualizePathStyle: {stroke: '#ffaa00'}});
  }
};

export const build = (creep: Creep): void => {
  const constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
  
  if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
    creep.moveTo(constructionSite, { visualizePathStyle: { stroke: '#ffffff' } });
  }
};

export const transfer = (creep: Creep): void => {
  let need = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: needStoragesFilter});
  if (need === null) {
    need = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: otherStoragesFilter});
  }

  if (creep.transfer(need, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    creep.moveTo(need, {visualizePathStyle: {stroke: '#ffffff'}});
  }
};

export const repair = (creep: Creep): void => {
  const repairSite = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: needRepairFilter});

  if (creep.repair(repairSite) === ERR_NOT_IN_RANGE) {
    creep.moveTo(repairSite, {visualizePathStyle: {stroke: '#ffffff'}});
  }
};

export const upgrade = (creep: Creep): void => {
  if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
    creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
  }
};

export const pickup = (creep: Creep): void => {
  const resources = roomStructureFinder.resources;
  let amount = 0;
  let resource: Resource<ResourceConstant>;
  for (const res of resources) {
    if (res.amount > amount) {
      amount = res.amount;
      resource = res;
    }
  }

  if (creep.pickup(resource) === ERR_NOT_IN_RANGE) {
    creep.moveTo(resource, {visualizePathStyle: {stroke: '#ffaa00'}});
  }
};

export const withdraw = (creep: Creep): void => {
  const tombstone = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
    filter: (t: Tombstone) => {
      return t.store.getUsedCapacity() > 0;
    }
  });
  if (tombstone !== null) {
    if (creep.withdraw(tombstone, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(tombstone, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
  } else {
    const ruin = creep.pos.findClosestByPath(FIND_RUINS, {
      filter: (ruin: Ruin) => {
        return ruin.store.getUsedCapacity() > 0;
      }
    });
    if (ruin !== null) {
      if (creep.withdraw(ruin, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(ruin, {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    } else {
      const store = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: hasEnergyStoragesFilter});
      if (creep.withdraw(store, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(store, {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }
  }
};

export const claim = (creep: Creep): void => {
  const controller = creep.room.controller;
  if (!controller.my) {
    creep.moveTo(controller, { visualizePathStyle: { stroke: '#ffffff' } });
    // if (creep.claimController(controller) === ERR_NOT_IN_RANGE) {}
  } else {
    const exit = creep.pos.findClosestByPath(FIND_EXIT_RIGHT);
    console.log('exit', exit);
    creep.moveTo(exit);
  }
};
