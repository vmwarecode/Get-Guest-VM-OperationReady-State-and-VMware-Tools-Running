// VMware vRealize Orchestrator action sample
//
// Get Guest VM State looking for Guest VM VMware Tools running and Guest Operations Ready.
// 
// For vRO/VRA 6.x/7.x
//
// Action Inputs:
// vCenterVm - VC:VirtualMachine - VC Virtual Machine Object
// timeoutInSeconds - number - Timeouts in seconds
// pollingIntervalInSeconds - number - Polling Intervals in seconds.
// Selva Jaganathan VMware Inc.
// Return type: void

if (vCenterVm == null) {
	throw "ReferenceError: vm is not defined for waiting for the DNS name";
}
else if (vCenterVm.name == null) {
	throw "ReferenceError: vm is not initialized for waiting for the DNS name";
}

System.log("Starting <getGuestVMStatus> for VM: " + vCenterVm.name);

var fatalMsg = null;

while (!fatalMsg) {
	if (isGuestVmAndToolIsRunning() && isVmReadyForGuestOperations()) {
		System.log("VM state is Good.");
		return true;
	} 
	else {
		System.log("VM state is Bad, still checking...");
		System.sleep(pollingIntervalInSeconds * 1000);
		timeoutInSeconds -= pollingIntervalInSeconds;
	}
	if (timeoutInSeconds <= 0) {
		fatalMsg = "Timeout: Timeout waiting for tools to be started on a running OS";
	}
}

if (fatalMsg) {
	System.log("Exception on VM State due to: " + fatalMsg);
	throw fatalMsg;
}

System.log("Ended <getGuestVMStatus>");

function isGuestVmAndToolIsRunning() {	
	return vCenterVm.guest.guestState === "running" && vCenterVm.guest.toolsRunningStatus === "guestToolsRunning";
} function isVmReadyForGuestOperations() {
	return vCenterVm.guest.guestOperationsReady;
} 