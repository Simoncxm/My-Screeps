import { harvest, build, transfer, repair, upgrade } from './actions';

interface CreepsController {
  run: (creep: Creep) => void,
  getSource: (creep: Creep) => void,
  work: (creep: Creep) => void,
}

export const getSources = (room: Room): Source[] => {
  return room.find(FIND_SOURCES_ACTIVE);
};

export const getStorages = (room: Room): AnyStructure[] => {
  return room.find(FIND_STRUCTURES, {
    filter: (structure: AnyStructure) => {
      return (structure.structureType === STRUCTURE_SPAWN ||
        structure.structureType === STRUCTURE_CONTAINER ||
        structure.structureType === STRUCTURE_EXTENSION) &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    }
  });
};

export const getContainer = (room: Room): AnyStructure[] => {
  return room.find(FIND_STRUCTURES, {
    filter: (structure: AnyStructure) => {
      return structure.structureType === STRUCTURE_CONTAINER &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    }
  });
};

export const getNeedSource = (room: Room): AnyStructure[] => {
  return room.find(FIND_STRUCTURES, {
    filter: (structure: AnyStructure) => {
      return (structure.structureType === STRUCTURE_SPAWN ||
        structure.structureType === STRUCTURE_EXTENSION) &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    }
  });
};

export const getConstructionSites = (room: Room): ConstructionSite<BuildableStructureConstant>[] => {
  return room.find(FIND_CONSTRUCTION_SITES);
};

export const getRepairableSites = (room: Room): AnyStructure[] => {
  return room.find(FIND_STRUCTURES, {
    filter: (structure: AnyStructure) => {
      return (structure.structureType === STRUCTURE_CONTAINER ||
        structure.structureType === STRUCTURE_ROAD) &&
        structure.hitsMax > structure.hits;
    }
  });
};

abstract class BaseController implements CreepsController {
  run = (creep: Creep): void => {
    if (creep.memory.working && creep.store.getUsedCapacity() === 0) {
      creep.memory.working = false;
      creep.say('get source');
    }
    if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
      creep.memory.working = true;
      creep.say('working');
    }

    if (creep.memory.working) {
      this.work(creep);
    } else {
      this.getSource(creep);
    }
  };
  abstract getSource(creep: Creep): void;
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
  getSource(creep: Creep): void {
    harvest(creep);
  }
}

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
  getSource(creep: Creep): void {
    harvest(creep);
  }
}

class UpgraderController extends BaseController {
  work(creep: Creep): void {
    upgrade(creep);
  }
  getSource(creep: Creep): void {
    harvest(creep);
  }
}

class MinerController extends BaseController {
  work(creep: Creep): void {
    harvest(creep);
  }
  getSource(creep: Creep): void {
    harvest(creep);
  }
}

class CarrierController extends BaseController {
  work(creep: Creep): void {
    harvest(creep);
  }
  getSource(creep: Creep): void {
    harvest(creep);
  }
}

const getRoleController = (role: Roles): CreepsController => {
  if (role === 'harvester') {
    return new HarvesterController;
  } else if (role === 'builder') {
    return new BuilderController;
  } else if (role === 'upgrader') {
    return new UpgraderController;
  }
};

export const runCreep = (creep: Creep): void => {
  const controller = getRoleController(creep.memory.role);
  controller.run(creep);
};
