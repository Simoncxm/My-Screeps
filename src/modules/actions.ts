export const harvest = (creep: Creep, target: Source) => {
  if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
  }
};

export const build = (creep: Creep, target: ConstructionSite<BuildableStructureConstant>) => {
  if (creep.build(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
  }
};

export const transfer = (creep: Creep, target: AnyStructure) => {
  if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
  }
};
