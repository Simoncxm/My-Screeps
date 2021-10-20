// 找需能量的建筑
export const needStoragesFilter = (structure: AnyStructure): boolean => {
  return (structure.structureType === STRUCTURE_SPAWN ||
    structure.structureType === STRUCTURE_EXTENSION ||
    structure.structureType === STRUCTURE_TOWER) &&
    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
};

// 找其他可存放的建筑
export const otherStoragesFilter = (structure: AnyStructure): boolean => {
  return (structure.structureType === STRUCTURE_CONTAINER ||
    structure.structureType === STRUCTURE_STORAGE) &&
    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
};

// 找存有能量的建筑
export const hasEnergyStoragesFilter = (structure: AnyStructure): boolean => {
  return (structure.structureType === STRUCTURE_CONTAINER ||
    structure.structureType === STRUCTURE_STORAGE) &&
    structure.store.getUsedCapacity() > 0;
};

// 找需维修建筑
export const needRepairFilter = (structure: AnyStructure): boolean => {
  return (structure.structureType === STRUCTURE_CONTAINER ||
    structure.structureType === STRUCTURE_ROAD) &&
    structure.hitsMax > structure.hits;
};

class RoomStructureFinder {
  sources: Source[];
  needStorages: AnyStructure[];
  hasStorages: AnyStructure[];
  constructionSites: ConstructionSite<BuildableStructureConstant>[];
  needRepairSites: AnyStructure[];
  resources: Resource<ResourceConstant>[];
  update(room: Room): void {
    this.sources = room.find(FIND_SOURCES_ACTIVE);
    this.needStorages = room.find(FIND_STRUCTURES, {filter: needStoragesFilter});
    this.hasStorages = room.find(FIND_STRUCTURES, {filter: hasEnergyStoragesFilter});
    this.constructionSites = room.find(FIND_CONSTRUCTION_SITES);
    this.needRepairSites = room.find(FIND_STRUCTURES, {filter: this.needRepairSites});
    this.resources = room.find(FIND_DROPPED_RESOURCES);
  }
}
export const roomStructureFinder = new RoomStructureFinder;
