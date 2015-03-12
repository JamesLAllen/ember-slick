var sequences = {
	show:'syncForward',
	hide:'syncReverse',
	childrenShow:'asyncForward',
	childrenHide:'asyncReverse',
	childrenCombined:'syncForward',
}

export default {
	sequences:sequences,
	completeOnHidden:true,
	setCss:true,
	// delayOffset:2,
	// delay:'*.03',  // can be number or string, if '*' exists, multiples by index
}