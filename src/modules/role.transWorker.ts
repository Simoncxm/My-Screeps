import { findClosest, harvest, build, transfer, repair } from './actions';

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
      const repairSites = creep.room.find(FIND_STRUCTURES, {
        filter: (structure: AnyStructure) => {
          return (structure.structureType === STRUCTURE_CONTAINER ||
            structure.structureType === STRUCTURE_ROAD) &&
            structure.hitsMax > structure.hits;
        }
      });

      if (creep.memory.role === 'harvester') {
        if (storages.length > 0) {
          const index = findClosest(creep, storages);
          transfer(creep, storages[index]);
        } else if (repairSites.length > 0) {
          const index = findClosest(creep, repairSites);
          repair(creep, repairSites[index]);
        } else {
          const index = findClosest(creep, constructionSites);
          build(creep, constructionSites[index]);
        }
      }
      else if (creep.memory.role === 'builder') {
        if (repairSites.length > 0) {
          const index = findClosest(creep, repairSites);
          repair(creep, repairSites[index]);
        } else if (constructionSites.length > 0) {
          const index = findClosest(creep, constructionSites);
          build(creep, constructionSites[index]);
        } else {
          const index = findClosest(creep, storages);
          transfer(creep, storages[index]);
        }
      }
    } else {
      const sources = creep.room.find(FIND_SOURCES_ACTIVE);
      const index = findClosest(creep, sources);
      harvest(creep, sources[index]);
    }
  }
};

export default roleTransWorker;
