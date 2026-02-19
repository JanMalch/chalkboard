import { mkdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs';

function exerciseId(v) {
  return `${v.targetId}-${v.goalId}-${v.abbreviation}`;
}

/**
 * Based on https://github.com/dewitt/opensearch/blob/master/mediawiki/Specifications/OpenSearch/Extensions/Suggestions/1.1/Draft%201.wiki
 * @param {string} baseUrl
 * @param {*} data
 */
export function writeSearchJsons(baseUrl, data) {
  rmSync('public/search', { recursive: true, force: true });
  mkdirSync('public/search');

  const goalIds = data.goals.map((v) => v.id);
  const targetIds = data.targets.map((v) => v.id);
  const filterIds = [
    ...goalIds,
    ...targetIds,
    ...goalIds.flatMap((g) => targetIds.map((t) => t + '-' + g)),
  ];
  /** @type {Map<string, any[]>} */
  const exercisesByFilterId = new Map(
    filterIds.map((filterId) => [filterId, []])
  );
  for (const v of data.exercises) {
    const vGoal = v.goalId;
    const vTarget = v.targetId;
    exercisesByFilterId.get(vGoal).push(v);
    exercisesByFilterId.get(vTarget).push(v);
    exercisesByFilterId.get(vTarget + '-' + vGoal).push(v);
  }
  exercisesByFilterId.forEach((value, key) => {
    const data = [
      key.toLowerCase(),
      value.map((v) => exerciseId(v)),
      value.map((v) => v.name),
      value.map((v) => baseUrl + '#' + exerciseId(v)),
    ];
    writeFileSync(
      `public/search/${key.toLowerCase()}.json`,
      JSON.stringify(data),
      'utf-8'
    );
  });
}
