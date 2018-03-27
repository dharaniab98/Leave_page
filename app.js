var controller = (function() {

  console.log('entered to controller');
  // Setting up EventListener for the two date input fields, 'request Leave', leaveType
  var setUpEventListeners = function() {
    document.querySelector('.fromDate').addEventListener('change', getFromDate);
    document.querySelector('.toDate').addEventListener('change', getToDate);
    document.querySelector('.leaveType').addEventListener('change', getLeaveType);
    document.querySelector('.requestLeave').addEventListener('click', validate);
    document.querySelector('.fromDate').addEventListener('blur', setEffectiveDays);
    document.querySelector('.toDate').addEventListener('blur', setEffectiveDays);
    document.querySelector('.checkEffectiveDays').addEventListener('click', setEffectiveDays);
    console.log("EventListener setup compvare");
  }


  /* ------------------------------------------------------------------------------------- */
  // getters

  // Leaves: Getting the leaves which are valid (i.e the leave Type that can be taken)
  var getValidLeaves = function(leaveType) {
    var leaves = ['casualLeave', 'medicalLeave', 'earnedLeave'];
    if (leaveType === leaves[0] || leaveType === leaves[1] || leaveType === leaves[2]) {
      return true;
    } else {
      return false;
    }
  }

  // Fetching selected leaveType form  DOM
  var getLeaveType = function() {
    var leaveType = document.querySelector('.leaveType').value;

    console.log(leaveType);
    return leaveType;
  }

  // Fetching selected FromDate form DOM
  var getFromDate = function() {
    var from = document.querySelector('.fromDate').value;
    from = parseInt(from.slice(8));

    console.log('From date: ' + from);
    return from;
  }

  // Fetching selected ToDate from DOM.
  var getToDate = function() {
    var to = document.querySelector('.toDate').value;
    to = parseInt(to.slice(8));

    console.log('To date: ' + to);
    return to;
  }

  // Making differnece to the dates provided based on range (i.e: valid or not).
  var getdiffernece = function(from, to) {
    if (from > to) {
      return false;
    } else {
      return to - from;
    }
  }

  // Unecessery function here just to add.
  var getAdd = function(count1, count2) {
    return parseInt(count1) + parseInt(count2);
  }

  // Fetching current pending leaves from the DOM
  var getPendingLeaves = function(leaveType) {
    console.log('leaveType: ' + leaveType);
    var pendingLeaves = document.querySelector('.' + leaveType + 'Pending').textContent;
    console.log('pendingLeaves: ' + pendingLeaves);

    return parseInt(pendingLeaves);
  }

  // Fetching currently Availed leaves form DOM
  var getAvailedLeaves = function(leaveType) {
    console.log('Leave Type: ' + leaveType);
    var availCount = document.querySelector('.' + leaveType + 'Availed').textContent;
    console.log('availleaves: ' + availCount);

    return parseInt(availCount);
  }


  /* ------------------------------------------------------------------------------------- */
  // Setters

  // Set the pendingLeaves into DOM
  var setPendingLeaves = function(leaveType, pendingCount) {
    console.log("LeaveType: " + leaveType + "pendingCount: " + pendingCount);
    document.querySelector('.' + leaveType + 'Pending').textContent = String(pendingCount);
  }

  // Set the availleaves into DOM
  var setAvailedLeaves = function(leaveType, availCount) {
    console.log(leaveType);
    document.querySelector('.' + leaveType + 'Availed').textContent = String(availCount);
  }

  // set the effectiveDays into DOM
  var setEffectiveDays = function() {
    var from = getFromDate();
    var to = getToDate();
    var effectiveDays = document.querySelector('.effectiveDays');
    if (isNaN(from) || isNaN(to)) {
      effectiveDays.value = "Not valid";
      return 0;
    }
    var diff = getdiffernece(from, to);
    if (diff) {
      effectiveDays.value = String(diff);
    } else {
      effectiveDays.value = "Not valid";
    }
  }


  /* ------------------------------------------------------------------------------------- */

  // Validators

  // Checking for the validity
  // This function is to check the following
    // 1. What leave type is selected,
    // 2. validating fromDate and toDate (i.e: based on the range),
    // 3. check for the leave type is valid or not.

    // RETURNS
      // 1. Array, when all conditions are valid
      // 2. 'invalid dates', when the dates are invalid based on the range
      // 3. false, when the leaveType is not a valid one.
  var checkValidity = function() {
    var leave = getLeaveType();
    console.log(leave);
    var from = getFromDate();
    var to = getToDate();
    var diff = getdiffernece(from, to);
    var validLeave = getValidLeaves(leave);
    console.log("validLeaves: " + validLeave + "\nleave: " + leave + "\nfrom: " + from + "\nto: " + to + "\ndiff: " + diff);

    if (validLeave) {
      if(diff) {
        return [leave, diff]
      } else {
        return 'invalid dates';
      }
    } else {
      return false;
    }
  }


  // This function is called when "Request Leave" is clicked
  // Thid function is to check the following based on calling checkValidity() function.
    // 1. If checkValidity() return 'Array', then **(Arrry contains: [0] --> leaveType, [1] --> days request for leave)**,
      // 1. Fetch pendingLeaves, availedleaves,
      // 2. set new pendingLeaves, new availleaves based upon the Array datails.
    // 2. if checkValidity() return 'invalid dates' then the dates selected are not valid,
    // 3. If checkValidity() return false then the leaveType is not valid.
  var validate = function() {
    leaveInfo = checkValidity();
    console.log("leaveInfo: " + leaveInfo);
    if(leaveInfo !== 'invalid dates' && leaveInfo !== false) {
      var pendingLeaves = getPendingLeaves(leaveInfo[0]);
      var availedleaves = getAvailedLeaves(leaveInfo[0]);
      console.log('pending leaves' + pendingLeaves);
      if (pendingLeaves >= leaveInfo[1]) {
        setPendingLeaves(leaveInfo[0], getdiffernece(leaveInfo[1], pendingLeaves));
        setAvailedLeaves(leaveInfo[0], getAdd(leaveInfo[1], availedleaves));
        alert('Leave Applied: ' + leaveInfo[0] + '\nDays: ' + leaveInfo[1] + '\nLeaves Availed');
      } else {
        alert('Please select leaves correctly');
      }
    } else if (leaveInfo === 'invalid dates'){
      alert('Please select valid leaves');
    } else {
      alert('Please select correct leave type');
    }
  }



  return {
    init: function() {
      setUpEventListeners();
      getLeaveType();
    }
  }
})();


controller.init();
