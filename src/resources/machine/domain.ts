import { Interpreter, State } from "xstate";

export interface MachineState {
  service: Interpreter<any, any>;
  state?: State<any, any>;
}
