export const objNameCreator = machineName => ({
  State: name => `x/${machineName}/${name}`,
  Guard: name => `xgrd/${machineName}/${name}`,
  Event: name => `xevt/${machineName}/${name}`,
  Action: name => `xact/${machineName}/${name}`,
  Acti: name => `xatv/${machineName}/${name}`,
  Service: name => `xsvc/${machineName}/${name}`
});
