import { describe, expect, it } from 'vitest';
import { jsonScript } from '../src/lib/security';

describe('jsonScript', () => {
  it('neutralizes </script> breakouts', () => {
    const out = jsonScript({ tagline: '</script><script>alert(1)</script>' });
    expect(out).not.toContain('</script>');
    expect(out).toContain('\\u003c/script');
    // Still valid JSON that round-trips to the original value.
    expect(JSON.parse(out)).toEqual({ tagline: '</script><script>alert(1)</script>' });
  });

  it('escapes JS line separators', () => {
    expect(jsonScript('a b c')).toBe('"a\\u2028b\\u2029c"');
  });

  it('passes ordinary trilingual content through unchanged', () => {
    expect(JSON.parse(jsonScript({ name: 'قدم‌ها', tagline: 'هره هڅه یو ګام و.' }))).toEqual({
      name: 'قدم‌ها',
      tagline: 'هره هڅه یو ګام و.',
    });
  });
});
