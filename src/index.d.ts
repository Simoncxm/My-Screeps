type Roles = 'harvester' | 'upgrader' | 'builder' | 'miner' | 'carrier';

interface CreepMemory {
  role: Roles;
  working?: boolean;
  upgrading?: boolean;
}