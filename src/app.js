/** @type {HTMLElement} */
const exercisesNode = document.getElementById('exercises');
/** @type {HTMLDetailsElement[]} */
const exerciseNodes = Array.from(exercisesNode.querySelectorAll('.exercise'));

console.time('initLookups');
const filterIds = [
  ...chalkboard.goals,
  ...chalkboard.targets,
  ...chalkboard.goals.flatMap((g) =>
    chalkboard.targets.map((t) => t + '-' + g)
  ),
];
/** @type {Map<string, HTMLDetailsElement[]>} */
const exercisesByFilterId = new Map(
  filterIds.map((filterId) => [filterId, []])
);
for (const node of exerciseNodes) {
  const nodeGoal = node.dataset.goal;
  const nodeTarget = node.dataset.target;
  exercisesByFilterId.get(nodeGoal).push(node);
  exercisesByFilterId.get(nodeTarget).push(node);
  exercisesByFilterId.get(nodeTarget + '-' + nodeGoal).push(node);
}
console.timeEnd('initLookups');

/**
 *
 * @param {HTMLDivElement[] | undefined} elements
 */
function setExerciseNodes(elements) {
  console.time('setExerciseNodes');
  exercisesNode.replaceChildren(...(elements || exerciseNodes));
  console.timeEnd('setExerciseNodes');
}

/** @type {string | undefined} */
let selectedGoal;
/** @type {string | undefined} */
let selectedTarget;

function update() {
  const filterId = selectedTarget
    ? selectedGoal
      ? `${selectedTarget}-${selectedGoal}`
      : selectedTarget
    : selectedGoal
      ? selectedGoal
      : undefined;
  console.log(
    'Updating with filterId = "%s" and lastQuery = "%s" ...',
    filterId || ''
  );
  if (!filterId) {
    setExerciseNodes();
    return;
  }
  const nodes = exercisesByFilterId.get(filterId);
  setExerciseNodes(nodes);
}

/**
 *
 * @param {string} goalId
 */
function selectGoal(goalId) {
  if (goalId === selectedGoal) {
    selectedGoal = undefined;
    update();
    return selectedGoal;
  }
  selectedGoal = goalId;
  update();
  return selectedGoal;
}

/**
 *
 * @param {string} targetId
 */
function selectTarget(targetId) {
  if (targetId === selectedTarget) {
    selectedTarget = undefined;
    update();
    return selectedTarget;
  }
  selectedTarget = targetId;
  update();
  return selectedTarget;
}

/**
 *
 * @param {string} chipId
 * @param {string} dialogId
 * @param {'targetId' | 'goalId'} typ
 */
function wireDialog(chipId, dialogId, typ) {
  /** @type {HTMLButtonElement} */
  const chipBtn = document.getElementById(chipId);
  /** @type {HTMLDialogElement} */
  const dialog = document.getElementById(dialogId);
  const closeBtn = dialog.querySelector('button');
  const liNodes = dialog.querySelectorAll('li[role="button"]');

  chipBtn.addEventListener('click', () => dialog.showModal());
  closeBtn.addEventListener('click', () => dialog.close());

  const isTarget = typ === 'targetId';
  const select = isTarget ? selectTarget : selectGoal;
  liNodes.forEach((liNode) => {
    const payload = liNode.dataset[typ];
    liNode.addEventListener('click', () => {
      const selected = select(payload);
      dialog.close();
      liNodes.forEach((x) => {
        const isActive = x.dataset[typ] === selected;
        if (isActive) {
          x.classList.add('active');
        } else {
          x.classList.remove('active');
        }
      });
    });
  });

  chipBtn.disabled = false;
}

wireDialog('goal-chip', 'goal-dialog', 'goalId');
wireDialog('target-chip', 'target-dialog', 'targetId');

/**
 * Indicates if sharing exercise link has completely failed once.
 */
let onShareExerciseLinkFails = false;

/**
 *
 * @param {HTMLAnchorElement} anchorNode
 * @param {Event} event
 * @param {string} shareText
 * @returns
 */
window.onShareExerciseLink = function (anchorNode, event, shareText) {
  const hasShare = typeof navigator['share'] !== 'undefined';
  const hasClipboard = typeof navigator['clipboard'] !== 'undefined';
  if (onShareExerciseLinkFails || (!hasShare && !hasClipboard)) {
    // No point in trying if APIs don't exist, or fail for some reason.
    // Don't prevent default so at least URL updates with anchor to copy.
    return;
  }
  event.preventDefault();
  if (hasShare) {
    navigator
      .share({ url: anchorNode.href, text: shareText, title: shareText })
      .catch((err) => {
        console.error('Error while sharing link:', err);
        if (hasClipboard) {
          navigator.clipboard.writeText(anchorNode.href).catch((err) => {
            console.error('Error while copying link:', err);
            onShareExerciseLinkFails = true;
          });
        } else {
          onShareExerciseLinkFails = true;
        }
      });
  } else if (hasClipboard) {
    navigator.clipboard.writeText(anchorNode.href).catch((err) => {
      console.error('Error while copying link:', err);
      onShareExerciseLinkFails = true;
    });
  }
};

// immediately open exercise, when page is loaded with that ID
if (location.hash.length > 1) {
  document.querySelector('details' + location.hash)?.setAttribute('open', '');
}
