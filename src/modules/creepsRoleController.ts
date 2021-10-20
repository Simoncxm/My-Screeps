import { harvest, build, transfer, repair, upgrade, pickup, withdraw, claim } from './actions';
import { roomStructureFinder } from './structureFilter';

interface CreepsController {
  run: (creep: Creep) => void,
  fill?: (creep: Creep) => void,
  work?: (creep: Creep) => void,
}

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
    if (roomStructureFinder.needStorages.length > 0) {
      transfer(creep);
    } else if (roomStructureFinder.needRepairSites.length > 0) {
      repair(creep);
    } else {
      build(creep);
    }
  }
  fill(creep: Creep): void {
    // harvest(creep, 1);
    withdraw(creep);
  }
}
const harvesterController = new HarvesterController;

class BuilderController extends BaseController {
  work(creep: Creep): void {
    if (roomStructureFinder.needRepairSites.length > 0) {
      repair(creep);
    } else if (roomStructureFinder.constructionSites.length > 0) {
      build(creep);
    } else {
      upgrade(creep);
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
    if (roomStructureFinder.hasStorages.length > 0) {
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

class TransfererController extends BaseController {
  work(creep: Creep): void {
    transfer(creep);
  }
  fill(creep: Creep): void {
    withdraw(creep);
  }
}
const transfererController = new TransfererController;

class MinerController implements CreepsController {
  index: number;
  run(creep: Creep): void {
    harvest(creep, this.index);
    this.index += 1;
  }
}
export const minerController = new MinerController;

class ClaimerController implements CreepsController {
  run(creep: Creep): void {
    claim(creep);
  }
}
const claimController = new ClaimerController;

const roleToController = {
  harvester: harvesterController,
  builder: builderController,
  upgrader: upgraderController,
  miner: minerController,
  carrier: carrierController,
  transferer: transfererController,
  claimer: claimController,
};

const getRoleController = (role: Roles): CreepsController => {
  let controller = roleToController[role];
  if (controller === undefined) {
    controller = {
      run: (creep: Creep) => {
        console.log('control by myself');
      }
    };
  }
  return controller;
};

export const runCreep = (creep: Creep): void => {
  const controller = getRoleController(creep.memory.role);
  controller.run(creep);
};
