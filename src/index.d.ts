type Roles = 'harvester' | 'upgrader' | 'builder' | 'miner' | 'carrier' | 'transferer' | 'claimer';

interface CreepMemory {
  role: Roles;
  working?: boolean;
  upgrading?: boolean;
}