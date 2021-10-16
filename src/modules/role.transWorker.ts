import { harvest, build, transfer } from './actions';

const roleTransWorker = {
  run: (creep: Creep): void => {
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.working = false;
      creep.say('🔄 harvest');
    } 
    if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
      creep.memory.working = true;
      creep.say('🚧 work');
    }
    
    if (creep.memory.working) {
      const storages = creep.room.find(FIND_STRUCTURES, {
        filter: (structure: AnyStructure) => {
          return (structure.structureType === STRUCTURE_SPAWN ||
            structure.structureType === STRUCTURE_CONTAINER ||
            structure.structureType === STRUCTURE_EXTENSION) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
      });
      const constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (creep.memory.role === 'harvester') {
        if (storages.length > 0) {
          transfer(creep, storages[0]);
        } else {
          build(creep, constructionSites[0]);
        }
      }
      else if (creep.memory.role === 'builder') {
        if (constructionSites.length > 0) {
          build(creep, constructionSites[0]);
        } else {
          transfer(creep, storages[0]);
        }
      }
    } else {
      const sources = creep.room.find(FIND_SOURCES);
      harvest(creep, sources[1]);
    }
  }
};

export default roleTransWorker;
