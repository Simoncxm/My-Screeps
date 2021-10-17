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

export const harvest = (creep: Creep, target: Source): void => {
  if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
  }
};

export const build = (creep: Creep, target: ConstructionSite<BuildableStructureConstant>): void => {
  if (creep.build(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
  }
};

export const transfer = (creep: Creep, target: AnyStructure): void => {
  if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
  }
};

export const repair = (creep: Creep, target: AnyStructure): void => {
  if (creep.repair(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
  }
};
