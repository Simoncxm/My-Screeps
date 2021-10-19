import { harvest, build, transfer, repair, upgrade, pickup, withdraw } from './actions';

interface CreepsController {
  run: (creep: Creep) => void,
  fill?: (creep: Creep) => void,
  work?: (creep: Creep) => void,
}

// 找矿
export const getSources = (room: Room): Source[] => {
  return room.find(FIND_SOURCES_ACTIVE);
};

// 找可存放的建筑
export const getStorages = (room: Room): AnyStructure[] => {
  return room.find(FIND_STRUCTURES, {
    filter: (structure: AnyStructure) => {
      return (structure.structureType === STRUCTURE_SPAWN ||
        structure.structureType === STRUCTURE_EXTENSION ||
        structure.structureType === STRUCTURE_TOWER ||
        structure.structureType === STRUCTURE_CONTAINER ||
        structure.structureType === STRUCTURE_STORAGE) &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    }
  });
};

// 找需能量的建筑
export const getNeedStorages = (room: Room): AnyStructure[] => {
  return room.find(FIND_STRUCTURES, {
    filter: (structure: AnyStructure) => {
      return (structure.structureType === STRUCTURE_SPAWN ||
        structure.structureType === STRUCTURE_EXTENSION ||
        structure.structureType === STRUCTURE_TOWER) &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    }
  });
};

// 找有能量的建筑
export const getStores = (room: Room) => {
  return room.find(FIND_STRUCTURES, {
    filter: (structure: AnyStructure) => {
      return (structure.structureType === STRUCTURE_CONTAINER ||
        structure.structureType === STRUCTURE_STORAGE) &&
        structure.store[RESOURCE_ENERGY] > 0;
    }
  });
};

// 找工地
export const getConstructionSites = (room: Room): ConstructionSite<BuildableStructureConstant>[] => {
  return room.find(FIND_CONSTRUCTION_SITES);
};

// 找需维修建筑
export const getRepairableSites = (room: Room): AnyStructure[] => {
  return room.find(FIND_STRUCTURES, {
    filter: (structure: AnyStructure) => {
      return (structure.structureType === STRUCTURE_CONTAINER ||
        structure.structureType === STRUCTURE_ROAD) &&
        structure.hitsMax > structure.hits;
    }
  });
};

// 找地下能量
export const getResources = (room: Room): Resource<ResourceConstant>[] => {
  return room.find(FIND_DROPPED_RESOURCES);
};

abstract class BaseController implements CreepsController {
  run(creep: Creep): void {
    if (creep.memory.working && creep.store.getUsedCapacity() === 0) {
      creep.memory.working = false;
      creep.say('fill');
    }
    if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
      creep.memory.working = true;
      creep.say('work');
    }

    if (creep.memory.working) {
      this.work(creep);
    } else {
      this.fill(creep);
    }
  }
  abstract fill(creep: Creep): void;
  abstract work(creep: Creep): void;
}

class HarvesterController extends BaseController {
  work(creep: Creep): void {
    if (getStorages(creep.room).length > 0) {
      transfer(creep);
    } else if (getRepairableSites(creep.room).length > 0) {
      repair(creep);
    } else {
      build(creep);
    }
  }
  fill(creep: Creep): void {
    harvest(creep, 1);
  }
}
const harvesterController = new HarvesterController;

class BuilderController extends BaseController {
  work(creep: Creep): void {
    if (getRepairableSites(creep.room).length > 0) {
      repair(creep);
    } else if (getConstructionSites(creep.room).length > 0) {
      build(creep);
    } else {
      transfer(creep);
    }
  }
  fill(creep: Creep): void {
    withdraw(creep);
  }
}
const builderController = new BuilderController;

class UpgraderController extends BaseController {
  work(creep: Creep): void {
    upgrade(creep);
  }
  fill(creep: Creep): void {
    if (getResources(creep.room).length > 0) {
      pickup(creep);
    } else if (getStores(creep.room).length > 0) {
      withdraw(creep);
    } else {
      harvest(creep, 0);
    }
  }
}
const upgraderController = new UpgraderController;

class CarrierController extends BaseController {
  work(creep: Creep): void {
    transfer(creep);
  }
  fill(creep: Creep): void {
    pickup(creep);
  }
}
const carrierController = new CarrierController;

class MinerController {
  index: number;
  run(creep: Creep): void {
    harvest(creep, this.index);
    this.index += 1;
  }
}
export const minerController = new MinerController;

const getRoleController = (role: Roles): CreepsController => {
  if (role === 'harvester') {
    return harvesterController;
  } else if (role === 'builder') {
    return builderController;
  } else if (role === 'upgrader') {
    return upgraderController;
  } else if (role === 'miner') {
    return minerController;
  } else if (role === 'carrier') {
    return carrierController;
  } else {
    return {
      run: (creep: Creep) => {
        console.log('control by myself');
      },
    };
  }
};

export const runCreep = (creep: Creep): void => {
  const controller = getRoleController(creep.memory.role);
  controller.run(creep);
};
