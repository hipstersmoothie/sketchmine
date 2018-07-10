import {
  PerformanceObserver,
  performance,
  PerformanceObserverEntryList,
} from 'perf_hooks';
import chalk from 'chalk';

/**
 * @example
    performance.mark('A');
    ...// things to measure
    performance.mark('Z');
    performance.measure('Name of measuring', 'A', 'Z');
 */
const observer = new PerformanceObserver((items: PerformanceObserverEntryList) => {
  const entry = items.getEntries()[0];
  console.log(
    chalk`${entry.name}\n ⇢ took `,
    chalk`{cyan ${entry.duration.toString()}ms}`,
  );
  performance.clearMarks();
});

observer.observe({ entryTypes: ['measure'] });

export default observer;
