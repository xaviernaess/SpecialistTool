/* Randomised, difficulty-specific VCE Specialist Mathematics questions.
   Keep calculations beside each prompt so every answer is derived from its parameters. */
(() => {
  'use strict';
  const levels = ['Easy', 'Medium', 'Hard', 'Very Hard'];
  const int = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const choose = xs => xs[int(0, xs.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const frac = (n, d) => {
    if (d < 0) { n = -n; d = -d; }
    const g = gcd(n, d) || 1;
    return d / g === 1 ? `${n / g}` : `\\frac{${n / g}}{${d / g}}`;
  };
  const signed = n => n < 0 ? `- ${Math.abs(n)}` : `+ ${n}`;
  const q = (topic, level, mode, prompt, answer, steps) => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    topic, difficulty: levels[level], mode, prompt, answer, steps, recorded: null
  });
  const polynomial3 = (r, s, t) => ({
    a: -(r + s + t), b: r * s + r * t + s * t, c: -r * s * t
  });
  const chooseN = (n, k) => {
    let value = 1;
    for (let i = 1; i <= k; i += 1) value = value * (n - i + 1) / i;
    return value;
  };
  const binomialP = (n, p, k) => chooseN(n, k) * p ** k * (1 - p) ** (n - k);
  const binomialCdf = (n, p, k) => Array.from({ length: Math.min(k, n) + 1 }, (_, i) => binomialP(n, p, i)).reduce((sum, value) => sum + value, 0);

  const bank = {
    algebra(level, mode) {
      const cas = mode === 'cas';
      if (level === 0 && !cas) {
        const x = int(-5, 6), a = int(2, 5), b = int(1, 7), c = int(-8, 8), rhs = a * (2 * x - b) + c;
        return q('algebra', level, mode, `Solve exactly for \\(x\\): \\(${a}(2x-${b}) ${signed(c)} = ${rhs}\\).`, `\\(x=${x}\\)`, [`Subtract \\(${c}\\): \\(${a}(2x-${b})=${rhs - c}\\).`, `Divide by \\(${a}\\), then add \\(${b}\\): \\(2x=${2 * x}\\), so \\(x=${x}\\).`]);
      }
      if (level === 0) {
        const x = int(-3, 4), y = int(-3, 4), a = int(2, 5), b = int(1, 4), c = int(1, 5), d = int(2, 5);
        return q('algebra', level, mode, `Use a CAS to solve the simultaneous equations \\( ${a}x+${b}y=${a * x + b * y}\\) and \\(${c}x-${d}y=${c * x - d * y}\\).`, `\\((x,y)=(${x},${y})\\)`, [`Enter the equations as a simultaneous system in the CAS.`, `The solution is \\(x=${x},\\ y=${y}\\).`, `Substitution checks: \\(${a}(${x})+${b}(${y})=${a * x + b * y}\\) and \\(${c}(${x})-${d}(${y})=${c * x - d * y}\\).`]);
      }
      if (level === 1 && !cas) {
        const x = int(-3, 6), m = int(2, 5), n = int(2, 6), p = int(1, 7), r = int(1, 7);
        const num = n * (x + p) + m * (x - r), den = m * n;
        return q('algebra', level, mode, `Solve \\(\\frac{x+${p}}{${m}}+\\frac{x-${r}}{${n}}=${frac(num, den)}\\).`, `\\(x=${x}\\)`, [`Multiply through by \\(${m * n}\\): \\(${n}(x+${p})+${m}(x-${r})=${num}\\).`, `Collect terms: \\(${m + n}x=${num - n * p + m * r}\\).`, `Divide by \\(${m + n}\\): \\(x=${x}\\).`]);
      }
      if (level === 1) {
        const r = int(-4, 3), s = int(r + 1, 5), t = int(s + 1, 6), c = polynomial3(r, s, t);
        return q('algebra', level, mode, `Use a CAS to solve \\(x^3 ${signed(c.a)}x^2 ${signed(c.b)}x ${signed(c.c)}=0\\). Give all roots.`, `\\(x=${r},\\ ${s},\\ ${t}\\)`, [`Use the CAS polynomial solve command for the cubic.`, `It returns \\(\\{${r},${s},${t}\\}\\).`, `Equivalently, the polynomial factors as \\((x-${r})(x-${s})(x-${t})\\).`]);
      }
      if (level === 2 && !cas) {
        let roots = [int(-5, 0), int(1, 5), int(2, 6)];
        if (new Set(roots).size < 3) roots = [-4, 2, 5];
        const c = polynomial3(...roots);
        return q('algebra', level, mode, `Factor and solve \\(x^3 ${signed(c.a)}x^2 ${signed(c.b)}x ${signed(c.c)}=0\\).`, `\\(x=${roots[0]},\\ ${roots[1]},\\ ${roots[2]}\\)`, [`Test integer factors of the constant term; \\(${roots[0]}\\) is a root.`, `Divide by \\((x-${roots[0]})\\) to obtain a quadratic with roots \\(${roots[1]}\\) and \\(${roots[2]}\\).`, `Thus \\((x-${roots[0]})(x-${roots[1]})(x-${roots[2]})=0\\), giving the three roots.`]);
      }
      if (level === 2) {
        const r = int(1, 3), s0 = int(2, 4), s = s0 === r ? (s0 % 3) + 2 : s0;
        return q('algebra', level, mode, `Use a CAS to solve the biquadratic equation \\(x^4-${r * r + s * s}x^2+${r * r * s * s}=0\\). Give all real roots and explain the substitution.`, `\\(x=${r},-${r},${s},-${s}\\).`, [`Set \\(u=x^2\\), giving \\(u^2-${r * r + s * s}u+${r * r * s * s}=0\\).`, `The CAS solves this as \\((u-${r * r})(u-${s * s})=0\\).`, `Thus \\(x^2=${r * r}\\) or \\(x^2=${s * s}\\), giving the four real roots shown.`, `Substitution into the quartic verifies each root.`]);
      }
      if (level === 3 && !cas) {
        const m = int(1, 4), c = m * (m + 1), low = -m, high = m + 1;
        return q('algebra', level, mode, `Determine all values of \\(k\\) for which \\(x^2-2kx+(k+${c})=0\\) has a repeated root. For each value, state that root and verify it.`, `\\(k=${low}\\) gives repeated root \\(x=${low}\\); \\(k=${high}\\) gives repeated root \\(x=${high}\\).`, [`A repeated root requires discriminant zero: \\((-2k)^2-4(k+${c})=0\\).`, `Divide by \\(4\\): \\(k^2-k-${c}=0=(k-${high})(k+${m})\\), so \\(k=${low}\\) or \\(k=${high}\\).`, `The repeated root is \\(x=-b/(2a)=k\\).`, `Substitution gives \\((x-${low})^2=0\\) at \\(k=${low}\\), and \\((x-${high})^2=0\\) at \\(k=${high}\\).`]);
      }
      return q('algebra', level, mode, `For real parameter \\(k\\), use CAS to classify the number of real solutions of \\(x^4-2kx^2+k^2-1=0\\). Give the solution set in each parameter range.`, `\\(k>1\\): four roots \\(x=\\pm\\sqrt{k+1},\\pm\\sqrt{k-1}\\); \\(k=1\\): three roots \\(0,\\pm\\sqrt2\\); \\(-1<k<1\\): two roots \\(\\pm\\sqrt{k+1}\\); \\(k=-1\\): one root \\(0\\); \\(k<-1\\): no real roots.`, [`Set \\(u=x^2\\ge0\\). Then \\(u^2-2ku+k^2-1=0\\), or \\((u-k)^2=1\\).`, `So \\(u=k+1\\) or \\(u=k-1\\); retain only non-negative values.`, `For each positive \\(u\\), there are two values of \\(x\\); for \\(u=0\\), there is one.`, `Sorting the cases by \\(k\\) gives the stated solution counts, including the boundary values.`]);
    },

    functions(level, mode) {
      const cas = mode === 'cas';
      if (level === 0 && !cas) {
        const a = int(2, 5), b = int(-5, 4), x = int(2, 5), inner = x * x + b;
        return q('functions', level, mode, `Let \\(f(x)=2x+${a}\\) and \\(g(x)=x^2${signed(b)}\\). Find \\(f(g(${x}))\\) and \\(g(f(${x}))\\).`, `\\(f(g(${x}))=${2 * inner + a}\\), \\(g(f(${x}))=${(2 * x + a) ** 2 + b}\\).`, [`First, \\(g(${x})=${inner}\\), so \\(f(g(${x}))=2(${inner})+${a}=${2 * inner + a}\\).`, `Also \\(f(${x})=${2 * x + a}\\), so \\(g(f(${x}))=(${2 * x + a})^2${signed(b)}=${(2 * x + a) ** 2 + b}\\).`, `The two compositions differ because function composition is not commutative.`]);
      }
      if (level === 0) {
        const a = int(1, 4), b = int(2, 8), x = int(-2, 3), y = a * x * x + b * x + 1;
        return q('functions', level, mode, `For \\(f(x)=${a}x^2+${b}x+1\\), use CAS table or graph features to evaluate \\(f(${x})\\) and find the axis of symmetry.`, `\\(f(${x})=${y}\\); axis: \\(x=-\\frac{${b}}{${2 * a}}\\).`, [`Enter \\(f(x)=${a}x^2+${b}x+1\\) and evaluate at \\(x=${x}\\): \\(f(${x})=${y}\\).`, `Read the symmetry axis from the graph, or use \\(x=-b/(2a)\\).`, `Thus the axis is \\(x=-${b}/${2 * a}=-\\frac{${b}}{${2 * a}}\\).`]);
      }
      if (level === 1 && !cas) {
        const a = int(2, 5), b = int(1, 7);
        return q('functions', level, mode, `The function \\(f(x)=\\sqrt{${a}x-${b}}\\) is restricted to its natural domain. State the domain of \\(f\\), and find \\(f^{-1}(x)\\) with its domain.`, `\\(\\operatorname{Dom}(f)=[${frac(b,a)},\\infty)\\); \\(f^{-1}(x)=\\frac{x^2+${b}}{${a}}\\), domain \\(x\\ge0\\).`, [`Require the radicand to be non-negative: \\(${a}x-${b}\\ge0\\), so \\(x\\ge${frac(b,a)}\\).`, `Set \\(y=\\sqrt{${a}x-${b}}\\). Squaring gives \\(y^2=${a}x-${b}\\).`, `Swap variables and solve: \\(f^{-1}(x)=\\frac{x^2+${b}}{${a}}\\).`, `The inverse domain is the range of \\(f\\), so \\(x\\ge0\\).`]);
      }
      if (level === 1) {
        const roots = [int(-4, -1), int(1, 5)], a = int(2, 6), c = -a * (roots[0] + roots[1]), d = a * roots[0] * roots[1];
        return q('functions', level, mode, `Use CAS graph/root tools to find all intersections of \\(y=${a}x^2${signed(c)}x${signed(d)}\\) and the \\(x\\)-axis. State the sign of the function between the roots.`, `Roots: \\(x=${roots[0]}, ${roots[1]}\\); the function is negative between them.`, [`Graph the function or use the CAS solve command.`, `The factorisation is \\(${a}(x-${roots[0]})(x-${roots[1]})\\), giving roots \\(x=${roots[0]}\\) and \\(x=${roots[1]}\\).`, `The leading coefficient is positive, so the graph opens upwards and is below the axis between its roots.`]);
      }
      if (level === 2 && !cas) {
        return q('functions', level, mode, `For \\(f(x)=x+\\frac{4}{x-2}\\), determine the domain and range.`, `Domain: \\(x\\ne2\\). Range: \\(y\\le-2\\) or \\(y\\ge6\\).`, [`The denominator requires \\(x\\ne2\\). Set \\(y=x+4/(x-2)\\) and let \\(t=x-2\\), so \\(y-2=t+4/t\\).`, `Rearrange: \\(t^2-(y-2)t+4=0\\). For real \\(t\\), its discriminant must satisfy \\((y-2)^2-16\\ge0\\).`, `Thus \\(|y-2|\\ge4\\), giving \\(y\\le-2\\) or \\(y\\ge6\\).`, `Both ranges occur: the quadratic in \\(t\\) has real nonzero roots whenever this condition holds.`]);
      }
      if (level === 2) {
        const roots = [int(-3, -1), int(1, 4)], a = int(2, 5), p = -(roots[0] + roots[1]), c = roots[0] * roots[1];
        const disc = Math.sqrt(4 * p * p - 12 * c), x1 = (-2 * p - disc) / 6, x2 = (-2 * p + disc) / 6;
        const y1 = a * (x1 ** 3 + p * x1 ** 2 + c * x1), y2 = a * (x2 ** 3 + p * x2 ** 2 + c * x2);
        return q('functions', level, mode, `Use CAS polynomial analysis to find the zeros and stationary points of \\(f(x)=${a}(x^3${signed(p)}x^2${signed(c)}x)\\). Give stationary coordinates to 3 decimal places.`, `Zeros: \\(x=0, ${roots[0]}, ${roots[1]}\\). Stationary points: \\(( ${x1.toFixed(3)}, ${y1.toFixed(3)})\\), \\(( ${x2.toFixed(3)}, ${y2.toFixed(3)})\\).`, [`Factor: \\(f(x)=${a}x(x-${roots[0]})(x-${roots[1]})\\), giving its zeros.`, `Differentiate: \\(f'(x)=${a}(3x^2+${2 * p}x+${c})\\).`, `Use CAS solve on \\(f'(x)=0\\), giving \\(x\\approx${x1.toFixed(3)}\\) and \\(x\\approx${x2.toFixed(3)}\\).`, `Substitute these abscissae into \\(f\\) to obtain ordinates \\(${y1.toFixed(3)}\\) and \\(${y2.toFixed(3)}\\).`]);
      }
      if (level === 3 && !cas) {
        const root = choose([1, 2, 3, 4]), a = root * root, difference = 4 * root ** 3;
        return q('functions', level, mode, `Let \\(f(x)=x^3-3ax\\), where \\(a>0\\). The difference between its local maximum and minimum values is \\(${difference}\\). Find \\(a\\), then give both stationary points and classify them.`, `\\(a=${a}\\); local maximum \\((-${root},${2 * root ** 3})\\), local minimum \\(( ${root},-${2 * root ** 3})\\).`, [`Differentiate: \\(f'(x)=3x^2-3a=0\\), so stationary abscissae are \\(x=\\pm\\sqrt a\\).`, `Evaluate: \\(f(-\\sqrt a)=2a^{3/2}\\) and \\(f(\\sqrt a)=-2a^{3/2}\\).`, `Their difference gives \\(4a^{3/2}=${difference}\\), so \\(a^{3/2}=${root ** 3}\\) and \\(a=${a}\\).`, `Substitution gives the stated coordinates; \\(f''(x)=6x\\) classifies the negative abscissa as a maximum and the positive one as a minimum.`]);
      }
      const roots = [int(-4, -1), int(1, 4)], c = -(roots[0] + roots[1]), d = roots[0] * roots[1];
      const disc = Math.sqrt(4 * c * c - 12 * d), x1 = (-2 * c - disc) / 6, x2 = (-2 * c + disc) / 6;
      return q('functions', level, mode, `Use a CAS to analyse \\(f(x)=x^3${signed(c)}x^2${signed(d)}x\\). Find its real zeros, stationary abscissae and the intervals on which it is increasing.`, `Zeros: \\(0,${roots[0]},${roots[1]}\\). Stationary abscissae: \\(x=${x1.toFixed(3)},${x2.toFixed(3)}\\). Increasing on \\(( -\\infty,${x1.toFixed(3)})\\cup(${x2.toFixed(3)},\\infty)\\).`, [`Factor or solve \\(f(x)=0\\): \\(x(x-${roots[0]})(x-${roots[1]})=0\\).`, `Use CAS differentiation: \\(f'(x)=3x^2+${2 * c}x+${d}\\).`, `Solving gives \\(x\\approx${x1.toFixed(3)}\\) and \\(x\\approx${x2.toFixed(3)}\\).`, `The derivative is an upward-opening quadratic, so it is positive outside these roots. Hence the function is increasing on the stated intervals.`]);
    },

    calculus(level, mode) {
      const cas = mode === 'cas';
      if (level === 0 && !cas) {
        const a = int(1, 4), b = int(1, 5), x = int(-2, 3), value = (2 * x + a) * (3 * x - b) + 3 * (x * x + a * x);
        return q('calculus', level, mode, `For \\(f(x)=(x^2+${a}x)(3x-${b})\\), find \\(f'(${x})\\) using the product rule.`, `\\(f'(${x})=${value}\\)`, [`Let \\(u=x^2+${a}x\\), \\(v=3x-${b}\\); then \\(u'=2x+${a}\\), \\(v'=3\\).`, `Use \\(f'=u'v+uv'\\).`, `At \\(x=${x}\\): \\((2(${x})+${a})(3(${x})-${b})+3((${x})^2+${a}(${x}))=${value}\\).`]);
      }
      if (level === 0) {
        const a = int(2, 5), b = int(2, 6), x = int(1, 4), value = 3 * x * x + 2 * a * x + b;
        return q('calculus', level, mode, `Use CAS differentiation to find the derivative of \\(f(x)=x^3+${a}x^2+${b}x\\), then evaluate the gradient at \\(x=${x}\\).`, `\\(f'(x)=3x^2+${2 * a}x+${b}\\); \\(f'(${x})=${value}\\).`, [`Enter \\(f(x)\\) and apply the CAS derivative command.`, `The derivative is \\(3x^2+${2 * a}x+${b}\\).`, `Substitute \\(x=${x}\\) to obtain \\(${value}\\).`]);
      }
      if (level === 1 && !cas) {
        const a = int(1, 4), b = int(1, 5), upper = int(2, 5), val = upper ** 3 + a * upper ** 2 - b * upper;
        return q('calculus', level, mode, `Evaluate exactly \\(\\int_0^{${upper}}(3x^2+${2 * a}x-${b})\\,dx\\).`, `\\(${val}\\)`, [`An antiderivative is \\(F(x)=x^3+${a}x^2-${b}x\\).`, `Apply the bounds: \\(F(${upper})-F(0)\\).`, `This is \\(${upper ** 3}+${a * upper ** 2}-${b * upper}=${val}\\).`]);
      }
      if (level === 1) {
        const a = int(2, 5), b = int(2, 6), x = int(1, 3), v = (x ** 4) / 4 + (a * x ** 3) / 3 + (b * x ** 2) / 2;
        return q('calculus', level, mode, `Use a CAS to evaluate \\(\\int_0^{${x}}(x^3+${a}x^2+${b}x)\\,dx\\) exactly.`, `\\(${frac(x ** 4, 4)}+${frac(a * x ** 3, 3)}+${frac(b * x ** 2, 2)}=${frac(Math.round(v * 12), 12)}\\).`, [`Enter the definite integral with the stated bounds.`, `The CAS returns \\(\\left[\\frac{x^4}{4}+\\frac{${a}x^3}{3}+\\frac{${b}x^2}{2}\\right]_0^{${x}}\\).`, `Substitute the bounds and simplify to \\(${frac(Math.round(v * 12), 12)}\\).`]);
      }
      if (level === 2 && !cas) {
        const p = int(4, 10), x = p / 2, area = p * p / 4;
        return q('calculus', level, mode, `A rectangle has perimeter \\(${2 * p}\\) units. Use calculus to determine its maximum possible area and dimensions.`, `Maximum area \\(${area}\\text{ units}^2\\), dimensions \\(${x}\\times${x}\\).`, [`Let sides be \\(x\\) and \\(p-x\\), since \\(2x+2y=2p\\).`, `Area \\(A(x)=x(p-x)=px-x^2\\); hence \\(A'(x)=p-2x\\).`, `Set \\(A'=0\\): \\(x=p/2=${x}\\), so the other side is also \\(${x}\\).`, `Because \\(A''(x)=-2<0\\), this is a maximum; \\(A_{max}=p^2/4=${area}\\).`]);
      }
      if (level === 2) {
        const a = int(2, 4), disc = Math.sqrt(a * a - 3), xm = (-a - disc) / 3, xp = (-a + disc) / 3;
        const fm = xm ** 3 + a * xm ** 2 + xm, fp = xp ** 3 + a * xp ** 2 + xp;
        return q('calculus', level, mode, `For \\(f(x)=x^3+${a}x^2+x\\), use CAS to find and classify both stationary points. Give coordinates to 3 decimal places.`, `Local maximum \\(( ${xm.toFixed(3)}, ${fm.toFixed(3)})\\); local minimum \\(( ${xp.toFixed(3)}, ${fp.toFixed(3)})\\).`, [`Differentiate: \\(f'(x)=3x^2+${2 * a}x+1\\).`, `Solve with CAS: \\(x=\\frac{-${a}\\pm\\sqrt{${a * a - 3}}}{3}\\), giving \\(x\\approx${xm.toFixed(3)}\\) and \\(x\\approx${xp.toFixed(3)}\\).`, `Substitute each value into \\(f\\) to obtain the coordinates shown.`, `Since \\(f''(x)=6x+${2 * a}\\), it is negative at the smaller root and positive at the larger root.`]);
      }
      if (level === 3 && !cas) {
        return q('calculus', level, mode, `A particle moves on a line with acceleration \\(a(t)=6t-6\\), initial velocity \\(v(0)=2\\) and position \\(s(0)=0\\). Find its first positive return to the origin and its velocity then.`, `First return: \\(t=1\\) s; velocity \\(v(1)=-1\\text{ m s}^{-1}\\).`, [`Integrate acceleration: \\(v(t)=3t^2-6t+C\\); from \\(v(0)=2\\), \\(C=2\\).`, `Integrate again: \\(s(t)=t^3-3t^2+2t+C_2\\); from \\(s(0)=0\\), \\(C_2=0\\).`, `Factor: \\(s(t)=t(t-1)(t-2)\\); the first positive return is \\(t=1\\).`, `Then \\(v(1)=3-6+2=-1\\), so it passes the origin in the negative direction.`]);
      }
      return q('calculus', level, mode, `A CAS model gives \\(s(t)=t^3-9t^2+24t\\), \\(0\\le t\\le6\\). Find when the particle is at rest and the position at each turning point.`, `Rest at \\(t=2,4\\); local maximum \\(s(2)=20\\), local minimum \\(s(4)=16\\).`, [`Differentiate: \\(v(t)=3t^2-18t+24=3(t-2)(t-4)\\).`, `Velocity changes from positive to negative at \\(t=2\\), then negative to positive at \\(t=4\\).`, `Evaluate \\(s(2)=8-36+48=20\\) and \\(s(4)=64-144+96=16\\).`, `Therefore these are respectively a local maximum and local minimum.`]);
    },

    vectors(level, mode) {
      const cas = mode === 'cas';
      if (level === 0 && !cas) {
        const a = int(1, 4), b = int(1, 4), c = int(1, 4), d = int(1, 4), dot = a * c + b * d, normU = a * a + b * b, normV = c * c + d * d;
        return q('vectors', level, mode, `For \\(\\mathbf u=(${a},${b})\\) and \\(\\mathbf v=(${c},${d})\\), find \\(\\mathbf u\\cdot\\mathbf v\\) and the exact expression for \\(\\cos\\theta\\), where \\(\\theta\\) is their angle.`, `Dot product \\(${dot}\\); \\(\\cos\\theta=\\frac{${dot}}{\\sqrt{${normU * normV}}}\\).`, [`Compute the dot product: \\(${a}(${c})+${b}(${d})=${dot}\\).`, `Magnitudes are \\(\\sqrt{${normU}}\\) and \\(\\sqrt{${normV}}\\).`, `Use \\(\\mathbf u\\cdot\\mathbf v=|\\mathbf u||\\mathbf v|\\cos\\theta\\) to obtain the stated cosine.`]);
      }
      if (level === 0) {
        const x0 = int(-3, 3), y0 = int(-3, 3), z0 = int(-3, 3), x = x0 || y0 || z0 ? x0 : 1, y = y0, z = z0, a = int(1, 4), dot = a * x + 2 * y - z;
        return q('vectors', level, mode, `Use a CAS vector dot-product command for \\(\\mathbf u=(${a},2,-1)\\), \\(\\mathbf v=(${x},${y},${z})\\). Determine whether the vectors are perpendicular.`, `\\(\\mathbf u\\cdot\\mathbf v=${dot}\\); ${dot === 0 ? 'they are perpendicular' : 'they are not perpendicular'}.`, [`Enter both vectors as ordered triples.`, `Evaluate \\(\\mathbf u\\cdot\\mathbf v=${a}(${x})+2(${y})-(${z})=${dot}\\).`, `Vectors are perpendicular exactly when their dot product is zero.`]);
      }
      if (level === 1 && !cas) {
        const p = [int(-3, 3), int(-3, 3), int(-3, 3)], d = [int(1, 4), int(1, 4), int(1, 4)], k = int(1, 4), point = p.map((v, i) => v + k * d[i]);
        return q('vectors', level, mode, `The line is \\(\\mathbf r=(${p.join(',')})+\\lambda(${d.join(',')})\\). Find the point corresponding to \\(\\lambda=${k}\\), then the distance from the origin to that point.`, `Point \\((${point.join(',')})\\); distance \\(\\sqrt{${point.reduce((sum, v) => sum + v * v, 0)}}\\).`, [`Substitute \\(\\lambda=${k}\\) componentwise: \\((${p.join(',')})+${k}(${d.join(',')})=(${point.join(',')})\\).`, `Use the 3D distance formula: \\(\\sqrt{${point.map(v => `${v}^2`).join('+')}}\\).`, `Therefore the distance is \\(\\sqrt{${point.reduce((sum, v) => sum + v * v, 0)}}\\).`]);
      }
      if (level === 1) {
        const p = [int(-3, 2), int(1, 4), int(-2, 3)], d = [int(1, 3), int(1, 3), int(1, 3)], k = int(1, 4), target = p.map((v, i) => v + k * d[i]);
        return q('vectors', level, mode, `For \\(\\mathbf r=(${p.join(',')})+t(${d.join(',')})\\), use CAS vector substitution to find the parameter at which the line reaches \\(${target.join(',')}\\).`, `\\(t=${k}\\).`, [`Enter the vector equation componentwise in the CAS.`, `Solve the three coordinate equations for \\(t\\).`, `They give the common value \\(t=${k}\\), and substitution confirms the point.`]);
      }
      if (level === 2 && !cas) {
        const u = [int(1, 4), int(1, 4), int(1, 4)], v = [int(1, 4), int(-3, 3), int(-3, 3)], cross = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]], dot = u.reduce((s, x, i) => s + x * v[i], 0);
        return q('vectors', level, mode, `For \\(\\mathbf u=(${u.join(',')})\\), \\(\\mathbf v=(${v.join(',')})\\), find the area of the parallelogram they span and determine whether their angle is acute, obtuse or right.`, `Area \\(\\sqrt{${cross.reduce((s, x) => s + x * x, 0)}}\\); angle is ${dot > 0 ? 'acute' : dot < 0 ? 'obtuse' : 'right'}.`, [`Compute \\(\\mathbf u\\times\\mathbf v=(${cross.join(',')})\\).`, `The parallelogram area is \\(\\lVert\\mathbf u\\times\\mathbf v\\rVert=\\sqrt{${cross.map(x => `${x}^2`).join('+')}}\\).`, `The dot product is \\(${dot}\\); its sign determines acute, obtuse or right.`]);
      }
      if (level === 2) {
        const p = [int(1, 4), int(1, 4), int(1, 4)], n = [int(1, 4), int(1, 4), int(1, 4)], rhs = p.reduce((s, x, i) => s + x * n[i], 0);
        return q('vectors', level, mode, `A plane has equation \\(${n[0]}x+${n[1]}y+${n[2]}z=${rhs}\\). Use the CAS to verify whether \\(${p.join(',')}\\) lies on it, and find a second point by setting \\(x=0,y=0\\).`, `\\((${p.join(',')})\\) lies on the plane; second point \\((0,0,${frac(rhs, n[2])})\\).`, [`Substitute \\(${p.join(',')}\\): the left side is \\(${rhs}\\), so the point lies on the plane.`, `Set \\(x=y=0\\), then solve \\(${n[2]}z=${rhs}\\).`, `This gives \\(z=${frac(rhs, n[2])}\\).`]);
      }
      if (level === 3 && !cas) {
        const u = [1, 0, 0], v = [0, 1, 0], w = [int(1, 4), int(1, 4), int(1, 4)], det = w[2];
        return q('vectors', level, mode, `A tetrahedron has three edge vectors from one vertex: \\(\\mathbf u=(1,0,0)\\), \\(\\mathbf v=(0,1,0)\\), \\(\\mathbf w=(${w.join(',')})\\). Derive its volume and explain when the three edges are coplanar.`, `Volume \\(\\frac{${det}}{6}\\); they are not coplanar because \\(\\mathbf u\\cdot(\\mathbf v\\times\\mathbf w)=${det}\\ne0\\).`, [`The parallelepiped volume is the absolute scalar triple product.`, `Compute \\(\\mathbf v\\times\\mathbf w=(${w[2]},0,-${w[0]})\\), then \\(\\mathbf u\\cdot(\\mathbf v\\times\\mathbf w)=${det}\\).`, `A tetrahedron has one-sixth of this volume: \\(${frac(det, 6)}\\).`, `The edges are coplanar precisely when the scalar triple product is zero; here it is nonzero.`]);
      }
      const n = [int(1, 3), int(1, 3), int(1, 3)], p = [int(-2, 2), int(-2, 2), int(-2, 2)], d = [n[1], -n[0], int(1, 3)], dot = n.reduce((s, x, i) => s + x * d[i], 0);
      const constant = n.reduce((s, x, i) => s + x * p[i], 0), t = -constant / dot, point = p.map((x, i) => x + t * d[i]);
      return q('vectors', level, mode, `A line passes through \\(${p.join(',')}\\) with direction \\(${d.join(',')}\\). A plane has normal \\(${n.join(',')}\\) and passes through the origin. Use CAS vector tools to find their intersection coordinates to 3 decimal places.`, `\\(t=${frac(-constant, dot)}\\); intersection \\(( ${point.map(x => Number(x.toFixed(3))).join(', ')})\\).`, [`The plane equation is \\(${n[0]}x+${n[1]}y+${n[2]}z=0\\).`, `Substitute \\(\\mathbf r=(${p.join(',')})+t(${d.join(',')})\\): \\(${constant}+${dot}t=0\\).`, `Solve to get \\(t=${frac(-constant, dot)}\\).`, `Substitute this parameter into the line and round the coordinates to 3 decimal places.`]);
    },

    complex(level, mode) {
      const cas = mode === 'cas';
      if (level === 0 && !cas) {
        const a = int(1, 4), b = int(1, 4), c = int(2, 5), d = int(1, 4), re = a * c - b * d, im = a * d + b * c;
        return q('complex', level, mode, `Write \\(((${a}+${b}i)(${c}+${d}i))\\) in the form \\(a+bi\\).`, `\\(${re}${im < 0 ? '-' : '+'}${Math.abs(im)}i\\)`, [`Expand: \\(${a}${c}+${a}${d}i+${b}${c}i+${b}${d}i^2\\).`, `Use \\(i^2=-1\\): real part \\(${a * c}-${b * d}=${re}\\), imaginary part \\(${a * d}+${b * c}=${im}\\).`, `Therefore the result is \\(${re}${im < 0 ? '-' : '+'}${Math.abs(im)}i\\).`]);
      }
      if (level === 0) {
        const a = int(2, 6), b = int(1, 4), re = a * a - b * b, im = 2 * a * b;
        return q('complex', level, mode, `Use a CAS to expand \\(((${a}+${b}i)^2)\\) and verify its modulus.`, `\\(${re}+${im}i\\); modulus \\(\\sqrt{${re * re + im * im}}=${a * a + b * b}\\).`, [`Expand or use the CAS complex-number command.`, `The square is \\(${a * a - b * b}+${2 * a * b}i\\).`, `Its modulus is \\(\\sqrt{(${re})^2+(${im})^2}=${a * a + b * b}\\).`]);
      }
      if (level === 1 && !cas) {
        const a = int(2, 5), b = int(1, 4);
        return q('complex', level, mode, `Solve \\(z^2=${a * a - b * b}+${2 * a * b}i\\) exactly.`, `\\(z=\\pm(${a}+${b}i)\\).`, [`Let \\(z=u+vi\\), then \\(u^2-v^2=${a * a - b * b}\\) and \\(2uv=${2 * a * b}\\).`, `The pair \\(u=${a},v=${b}\\) satisfies both equations; changing both signs gives the other root.`, `Thus \\(z=\\pm(${a}+${b}i)\\).`]);
      }
      if (level === 1) {
        return q('complex', level, mode, `Use CAS complex solve to find all roots of \\(z^3=8\\), then express them in rectangular form.`, `\\(z=2,\\ -1+i\\sqrt3,\\ -1-i\\sqrt3\\).`, [`Write \\(8=8\\operatorname{cis}(2k\\pi)\\).`, `The cube roots have modulus \\(2\\) and arguments \\(0,2\\pi/3,4\\pi/3\\).`, `Use CAS complex solve to verify the three roots.`, `Substitution confirms that each root cubes to \\(8\\).`]);
      }
      if (level === 2 && !cas) {
        const n = choose([5, 7]), re = n === 5 ? '16' : '64', im = n === 5 ? '-16\\sqrt3' : '64\\sqrt3';
        return q('complex', level, mode, `Use De Moivre's theorem to express \\((1+i\\sqrt3)^{${n}}\\) in rectangular form, showing the modulus and argument first.`, `\\(${re}${n === 5 ? '' : '+'}${im}i\\).`, [`The base has modulus \\(2\\) and argument \\(\\pi/3\\), so it is \\(2\\operatorname{cis}(\\pi/3)\\).`, `Its power is \\(2^{${n}}\\operatorname{cis}(${n}\\pi/3)\\).`, `Reduce the angle modulo \\(2\\pi\\), then use the exact sine and cosine values.`, `This gives \\(${re}${n === 5 ? '' : '+'}${im}i\\).`]);
      }
      if (level === 2) {
        const a = int(1, 3), b = int(1, 3), c = int(2, 4), d = int(1, 3), re = a * c - b * d, im = a * d + b * c;
        return q('complex', level, mode, `Use CAS complex polynomial solving to find both roots of \\(z^2-(${a + c}+${b + d}i)z+(${re}${im < 0 ? '' : '+'}${im}i)=0\\).`, `\\(z=${a}+${b}i\\) or \\(z=${c}+${d}i\\).`, [`Enter the quadratic in complex mode and request both roots.`, `The roots are \\(z_1=${a}+${b}i\\) and \\(z_2=${c}+${d}i\\).`, `Check their sum is \\(${a + c}+${b + d}i\\) and product is \\(${re}${im < 0 ? '' : '+'}${im}i\\).`, `Thus the monic polynomial is \\(z^2-(${a + c}+${b + d}i)z+(${re}${im < 0 ? '' : '+'}${im}i)\\).`]);
      }
      if (level === 3 && !cas) {
        const n = choose([5, 7, 8]);
        return q('complex', level, mode, `Find all roots of \\(z^{${n}}=1\\) in cis form. Show why their arguments are equally spaced and state the sum of all roots.`, `\\(z_k=\\operatorname{cis}(2k\\pi/${n}),\\ k=0,1,\\ldots,${n - 1}\\); sum \\(0\\).`, [`Write \\(1=\\operatorname{cis}(2m\\pi)\\) for integer \\(m\\).`, `Taking the \\(${n}\\)-th roots gives \\(z=\\operatorname{cis}(2m\\pi/${n})\\).`, `Distinct roots use \\(m=0,1,\\ldots,${n - 1}\\); adjacent arguments differ by \\(2\\pi/${n}\\).`, `They form a regular polygon centred at the origin, so their vector sum is \\(0\\).`]);
      }
      const n = choose([5, 6, 7]);
      return q('complex', level, mode, `Use CAS polynomial root tools to solve \\(z^{${n}}+1=0\\), select the roots in the upper half-plane, and state their arguments.`, `Arguments are \\(\\frac{(2k+1)\\pi}{${n}}\\) for integers \\(k\\) that place the angle in \\((0,\\pi)\\).`, [`Solve \\(z^{${n}}=-1=\\operatorname{cis}((2m+1)\\pi)\\).`, `The roots are \\(\\operatorname{cis}((2m+1)\\pi/${n})\\), for \\(m=0,\\ldots,${n - 1}\\).`, `Keep the arguments in \\((0,\\pi)\\) to select the upper half-plane roots.`, `Check the selected roots numerically or by raising each to the \\(${n}\\)-th power.`]);
    },

    mechanics(level, mode) {
      const cas = mode === 'cas';
      if (level === 0 && !cas) {
        const u = int(2, 8), a = int(1, 4), t = int(2, 5), v = u + a * t, s = u * t + a * t * t / 2;
        return q('mechanics', level, mode, `A particle starts at \\(u=${u}\\,\\text{m s}^{-1}\\) and accelerates uniformly at \\(a=${a}\\,\\text{m s}^{-2}\\) for \\(t=${t}\\) s. Find its final velocity and displacement.`, `\\(v=${v}\\,\\text{m s}^{-1}\\), \\(s=${s}\\,\\text{m}\\).`, [`Use \\(v=u+at\\): \\(v=${u}+${a}(${t})=${v}\\).`, `Use \\(s=ut+\\frac12at^2\\): \\(s=${u}(${t})+\\frac12(${a})(${t})^2=${s}\\).`]);
      }
      if (level === 0) {
        const u = int(4, 12), a = choose([-3, -2, -1, 1, 2, 3, 4]), t = int(1, 5), v = u + a * t;
        return q('mechanics', level, mode, `Use CAS kinematics calculations for initial velocity \\(${u}\\,\\text{m s}^{-1}\\), acceleration \\(${a}\\,\\text{m s}^{-2}\\), over \\(${t}\\) s. Find final velocity and displacement.`, `\\(v=${v}\\,\\text{m s}^{-1}\\), \\(s=${u * t + a * t * t / 2}\\,\\text{m}\\).`, [`Enter \\(v=u+at\\) and \\(s=ut+\\frac12at^2\\) into the CAS.`, `Substitute the given values and evaluate.`, `Check the units: velocity in \\(\\text{m s}^{-1}\\), displacement in metres.`]);
      }
      if (level === 1 && !cas) {
        const u = int(10, 20), g = 10, h = u * u / (2 * g), t = u / g;
        return q('mechanics', level, mode, `A particle is projected vertically upwards at \\(${u}\\,\\text{m s}^{-1}\\). Take gravity as \\(10\\,\\text{m s}^{-2}\\). Find its maximum height and total flight time.`, `Maximum height \\(${h}\\) m; flight time \\(${2 * t}\\) s.`, [`At maximum height, \\(v=0\\). Use \\(v^2=u^2-2gh\\): \\(h=u^2/(2g)=${h}\\).`, `Time to the top is \\(0=u-gt\\), so \\(t=u/g=${t}\\) s.`, `By symmetry the return flight takes the same time, giving \\(${2 * t}\\) s.`]);
      }
      if (level === 1) {
        const u = int(12, 20), a = int(2, 5), t = int(2, 5), v = u + a * t, s = u * t + a * t * t / 2;
        return q('mechanics', level, mode, `For a particle with \\(u=${u}\\), constant \\(a=${a}\\), and observed displacement \\(s=${s}\\) m, use CAS equation solving to find the positive time and final velocity.`, `\\(t=${t}\\) s and \\(v=${v}\\,\\text{m s}^{-1}\\).`, [`Solve \\(s=ut+\\frac12at^2\\): \\(${s}=${u}t+\\frac12(${a})t^2\\).`, `CAS roots include \\(t=${t}\\); discard the negative root because time is positive.`, `Then \\(v=u+at=${u}+${a}(${t})=${v}\\).`]);
      }
      if (level === 2 && !cas) {
        const u = int(12, 20), theta = choose([30, 45, 60]), g = 10;
        const vx = theta === 30 ? `${u}\\frac{\\sqrt3}{2}` : theta === 60 ? `${u}\\frac12` : `${u}\\frac{\\sqrt2}{2}`;
        const uy = theta === 30 ? `${u}/2` : theta === 60 ? `${u}\\sqrt3/2` : `${u}\\sqrt2/2`;
        const results = theta === 30 ? [`${u}/10`, `\\frac{${u * u}\\sqrt3}{20}`, `${u * u}/80`] : theta === 45 ? [`${u}\\sqrt2/10`, `${u * u}/10`, `${u * u}/40`] : [`${u}\\sqrt3/10`, `\\frac{${u * u}\\sqrt3}{20}`, `\\frac{3${u * u}}{80}`];
        return q('mechanics', level, mode, `A projectile is launched from level ground at \\(${u}\\,\\text{m s}^{-1}\\) and angle \\(${theta}^\\circ\\). With \\(g=10\\,\\text{m s}^{-2}\\), derive its flight time, range and maximum height exactly.`, `\\(T=${results[0]}\\text{ s},\\quad R=${results[1]}\\text{ m},\\quad H=${results[2]}\\text{ m}.\\)`, [`Resolve velocity: \\(u_x=${vx}\\), \\(u_y=${uy}\\).`, `Vertical displacement is zero at landing: \\(0=u_yT-5T^2\\), so \\(T=u_y/5\\).`, `Substitute into \\(R=u_xT\\); at the top, \\(0=u_y^2-20H\\), so \\(H=u_y^2/20\\).`]);
      }
      if (level === 2) {
        const u = int(10, 18), a = int(2, 5), time = int(3, 6), distance = u * time + a * time * time / 2;
        return q('mechanics', level, mode, `A particle moves with \\(s(t)=ut+\\frac12at^2\\), where \\(u=${u}\\) and \\(a\\) is constant. At \\(t=${time}\\) it has travelled \\(${distance}\\) m. Use CAS to determine \\(a\\) and its velocity then.`, `\\(a=${a}\\,\\text{m s}^{-2}\\), \\(v=${u + a * time}\\,\\text{m s}^{-1}\\).`, [`Substitute the displacement: \\(${distance}=${u}(${time})+\\frac12a(${time})^2\\).`, `Solve this linear equation for \\(a=${a}\\).`, `Then \\(v=u+at=${u}+${a}(${time})=${u + a * time}\\).`]);
      }
      if (level === 3 && !cas) {
        const c = int(1, 4);
        return q('mechanics', level, mode, `A particle has acceleration \\(a(t)=${6 * c}t-${6 * c}\\), with \\(v(0)=${2 * c}\\) and \\(s(0)=0\\). Determine its first return to the origin, its direction there, and total distance travelled up to that time.`, `First return \\(t=1\\); velocity \\(-${c}\\,\\text{m s}^{-1}\\); distance \\(\\frac{2${c}}{3\\sqrt3}\\text{ m}\\).`, [`Integrate twice: \\(v=${c}(3t^2-6t+2)\\), \\(s=${c}(t^3-3t^2+2t)=${c}t(t-1)(t-2)\\).`, `The first positive zero of \\(s\\) is \\(t=1\\), and \\(v(1)=-${c}\\), so it crosses in the negative direction.`, `The maximum positive displacement occurs before the return when \\(v=0\\): \\(t=1-1/\\sqrt3\\).`, `Substitute into \\(s(t)\\) to get \\(s_{max}=2${c}/(3\\sqrt3)\\); this is the total distance before returning.`]);
      }
      return q('mechanics', level, mode, `A CAS model gives \\(s(t)=t^3-6t^2+9t\\), \\(0\\le t\\le5\\). Find when the particle is at rest, determine when it moves forwards, and calculate its maximum position.`, `\\(v(t)=3(t-1)(t-3)\\); rest at \\(t=1,3\\), moving forwards on \\([0,1)\\cup(3,5]\\); maximum position is \\(s(5)=20\\text{ m}\\).`, [`Differentiate: \\(v(t)=3t^2-12t+9=3(t-1)(t-3)\\).`, `The sign chart gives positive velocity outside \\((1,3)\\) and negative velocity inside.`, `Compare position at endpoints and stationary times: \\(s(0)=0,s(1)=4,s(3)=0,s(5)=20\\).`, `Thus the maximum position on the interval is \\(20\\) m at \\(t=5\\) s.`]);
    },

    probability(level, mode) {
      const cas = mode === 'cas';
      if (level === 0 && !cas) {
        const r = int(3, 6), b = int(2, 5), n = r + b;
        return q('probability', level, mode, `A bag contains \\(${r}\\) red and \\(${b}\\) blue counters. Two are drawn without replacement. Find the probability both are red and the probability of one of each colour.`, `Both red: \\(\\frac{${r * (r - 1)}}{${n * (n - 1)}}=${frac(r * (r - 1), n * (n - 1))}\\); one each: \\(\\frac{${2 * r * b}}{${n * (n - 1)}}=${frac(2 * r * b, n * (n - 1))}\\).`, [`For two red: \\(\\frac{${r}}{${n}}\\cdot\\frac{${r - 1}}{${n - 1}}\\).`, `For one of each, add red-blue and blue-red: \\(2\\cdot\\frac{${r}}{${n}}\\cdot\\frac{${b}}{${n - 1}}\\).`, `Simplify each fraction.`]);
      }
      if (level === 0) {
        const n = int(20, 60), p = choose([0.2, 0.25, 0.3, 0.4]), k = Math.round(n * p);
        return q('probability', level, mode, `A CAS generates \\( ${n}\\) independent trials with success probability \\(p=${p}\\). Find the expected number of successes and the standard deviation.`, `\\(E(X)=${n * p}\\); \\(\\sigma=\\sqrt{${n * p * (1 - p)}}\\approx${Math.sqrt(n * p * (1 - p)).toFixed(2)}\\).`, [`Model \\(X\\sim\\operatorname{Bin}(${n},${p})\\).`, `Use \\(E(X)=np=${n}(${p})=${n * p}\\).`, `Variance is \\(np(1-p)=${n * p * (1 - p)}\\); take its square root for the standard deviation.`]);
      }
      if (level === 1 && !cas) {
        const r = int(3, 6), b = int(3, 7), n = r + b, pA = frac(r, n), pB = frac(b, n);
        return q('probability', level, mode, `A box has \\(${r}\\) red and \\(${b}\\) blue counters. Two are drawn without replacement. Given the first is red, find the probability the second is blue. Then find the probability of exactly one red.`, `Conditional probability \\(\\frac{${b}}{${n - 1}}\\); exactly one red \\(\\frac{${2 * r * b}}{${n * (n - 1)}}=${frac(2 * r * b, n * (n - 1))}\\).`, [`Given the first is red, \\(${r - 1}\\) red and \\(${b}\\) blue remain, so the conditional probability is \\(${b}/${n - 1}\\).`, `Exactly one red occurs in either order: \\(RB\\) or \\(BR\\).`, `Add their probabilities: \\(2\\cdot(${r}/${n})(${b}/${n - 1})=${frac(2 * r * b, n * (n - 1))}\\).`]);
      }
      if (level === 1) {
        const n = int(12, 30), p = choose([0.2, 0.25, 0.3, 0.4]), k = int(1, Math.min(4, n));
        return q('probability', level, mode, `For \\(X\\sim\\operatorname{Bin}(${n},${p})\\), use a CAS distribution command to calculate \\(P(X\\le ${k})\\) and \\(P(X>${k})\\).`, `\\(P(X\\le${k})=\\sum_{j=0}^{${k}}\\binom{${n}}j(${p})^j(${1 - p})^{${n}-j}\\); \\(P(X>${k})=1-P(X\\le${k})\\).`, [`Enter the cumulative binomial probability in the CAS.`, `Alternatively sum \\(\\binom{${n}}j(${p})^j(${1 - p})^{${n}-j}\\) for \\(j=0\\) through \\(${k}\\).`, `Use the complement for \\(P(X>${k})\\).`]);
      }
      if (level === 2 && !cas) {
        const n = int(5, 9), p = choose([0.25, 0.3, 0.4]), mu = n * p, variance = n * p * (1 - p);
        return q('probability', level, mode, `A component fails independently with probability \\(p=${p}\\). In a batch of \\(${n}\\), let \\(X\\) be the number that fail. Find \\(E(X)\\), \\(\\operatorname{Var}(X)\\), and the probability that at least two fail.`, `\\(E(X)=${mu}\\), variance \\(${variance}\\); \\(P(X\\ge2)=1-(${1 - p})^{${n}}-${n}(${p})(${1 - p})^{${n - 1}}\\).`, [`Recognise \\(X\\sim\\operatorname{Bin}(${n},${p})\\).`, `Use \\(E(X)=np=${mu}\\) and \\(\\operatorname{Var}(X)=np(1-p)=${variance}\\).`, `Use the complement: \\(P(X\\ge2)=1-P(X=0)-P(X=1)\\).`, `Substitute the binomial probabilities shown in the answer.`]);
      }
      if (level === 2) {
        const n = int(30, 80), p = choose([0.25, 0.3, 0.4]), k = Math.round(n * p), mu = n * p, sd = Math.sqrt(n * p * (1 - p)), probability = 1 - binomialCdf(n, p, k - 1);
        return q('probability', level, mode, `For \\(X\\sim\\operatorname{Bin}(${n},${p})\\), use CAS to find \\(P(X\\ge${k})\\), then interpret the result as a percentage of repeated samples.`, `\\(P(X\\ge${k})\\approx${probability.toFixed(4)}\\); \\(E(X)=${mu}\\), \\(\\sigma\\approx${sd.toFixed(2)}\\).`, [`Use the CAS cumulative distribution function for \\(P(X\\le${k - 1})\\).`, `Subtract from one: \\(P(X\\ge${k})=1-P(X\\le${k - 1})\\approx${probability.toFixed(4)}\\).`, `The probability is the long-run proportion of batches with at least \\(${k}\\) successes.`, `Check its scale against mean \\(${mu}\\) and standard deviation \\(${sd.toFixed(2)}\\).`]);
      }
      if (level === 3 && !cas) {
        const r = int(3, 6), b = int(3, 6), committee = 3, total = chooseN(r + b, committee);
        const probabilities = Array.from({ length: committee + 1 }, (_, k) => chooseN(r, k) * chooseN(b, committee - k));
        const expected = committee * r / (r + b), atLeastTwo = probabilities.slice(2).reduce((sum, count) => sum + count, 0);
        return q('probability', level, mode, `A committee of \\(${committee}\\) is chosen uniformly from \\(${r}\\) students who study Specialist Maths and \\(${b}\\) who do not. Let \\(X\\) count Specialist Maths students. Find its distribution, expectation and \\(P(X\\ge2)\\).`, `\\(P(X=k)=\\frac{\\binom{${r}}{k}\\binom{${b}}{${committee}-k}}{\\binom{${r + b}}${committee}}, \\quad E(X)=${frac(committee * r, r + b)}, \\quad P(X\\ge2)=${frac(atLeastTwo, total)}\\).`, [`Use the hypergeometric count: favourable committees for \\(X=k\\) are \\(\\binom{${r}}{k}\\binom{${b}}{${committee}-k}\\).`, `The total number of committees is \\(\\binom{${r + b}}{${committee}}=${total}\\).`, `The expectation is \\(nK/N=${committee}(${r})/${r + b}=${expected}\\).`, `Add the counts for \\(k=2\\) and \\(k=3\\): \\(${atLeastTwo}/${total}=${frac(atLeastTwo, total)}\\).`]);
      }
      const n = int(40, 100), p = choose([0.25, 0.35, 0.4]);
      let percentile = 0;
      while (percentile < n && binomialCdf(n, p, percentile) < 0.95) percentile += 1;
      return q('probability', level, mode, `A CAS quality-control model has \\(X\\sim\\operatorname{Bin}(${n},${p})\\). Find the smallest integer \\(c\\) such that \\(P(X\\le c)\\ge0.95\\), and explain the interpretation.`, `\\(c=${percentile}\\); \\(P(X\\le${percentile - 1})=${binomialCdf(n, p, percentile - 1).toFixed(4)}<0.95\\le P(X\\le${percentile})=${binomialCdf(n, p, percentile).toFixed(4)}\\).`, [`Use the CAS inverse cumulative distribution for \\(\\operatorname{Bin}(${n},${p})\\) at probability \\(0.95\\).`, `The smallest integer reaching the cutoff is \\(c=${percentile}\\).`, `Interpretation: at least 95% of batches have no more than \\(${percentile}\\) successes.`, `The previous cumulative value is below 0.95, which verifies minimality.`]);
    },

    trigonometry(level, mode) {
      const cas = mode === 'cas';
      if (level === 0 && !cas) {
        const angle = choose([30, 45, 60, 120, 135, 150]);
        const values = {30:'1/2',45:'\\sqrt2/2',60:'\\sqrt3/2',120:'\\sqrt3/2',135:'\\sqrt2/2',150:'1/2'};
        const positive = angle < 180;
        return q('trigonometry', level, mode, `Given \\(\\sin\\theta=${values[angle]}\\) and \\(0^\\circ<\\theta<180^\\circ\\), determine all possible values of \\(\\theta\\) and state why there may be two.`, `\\(\\theta=${angle}^\\circ\\) or \\(${180 - angle}^\\circ\\) (coincident if \\(90^\\circ\\)).`, [`The reference angle is \\(${angle > 90 ? 180 - angle : angle}^\\circ\\).`, `Sine is positive in quadrants I and II over this interval.`, `Thus the solutions are the reference angle and its supplement: \\(${angle}^\\circ\\) and \\(${180 - angle}^\\circ\\).`]);
      }
      if (level === 0) {
        return q('trigonometry', level, mode, `Use a CAS graph and numeric solver to find every solution of \\(\\sin\\theta+\\cos\\theta=1\\) on \\(0^\\circ\\le\\theta<360^\\circ\\).`, `\\(\\theta=0^\\circ,90^\\circ\\).`, [`Plot \\(y=\\sin\\theta+\\cos\\theta\\) with \\(y=1\\) in degree mode.`, `The intersections in the interval are \\(0^\\circ\\) and \\(90^\\circ\\).`, `Algebraically, \\(\\sqrt2\\sin(\\theta+45^\\circ)=1\\), which gives the same two angles.`, `Substitute each angle into the original equation.`]);
      }
      if (level === 1 && !cas) {
        const k = choose([2, 3, 4]);
        return q('trigonometry', level, mode, `Solve \\(2\\sin^2\\theta-1=0\\) for \\(0\\le\\theta<2\\pi\\), giving exact answers.`, `\\(\\theta=\\frac{\\pi}{4},\\frac{3\\pi}{4},\\frac{5\\pi}{4},\\frac{7\\pi}{4}\\).`, [`Use \\(2\\sin^2\\theta-1=0\\Rightarrow\\sin^2\\theta=1/2\\).`, `Hence \\(\\sin\\theta=\\pm1/\\sqrt2\\).`, `On \\([0,2\\pi)\\), the four angles are the stated diagonal quadrantal angles.`]);
      }
      if (level === 1) {
        const x = choose([30, 45, 60]);
        const val = Math.sin(x * Math.PI / 180) + Math.cos(2 * x * Math.PI / 180);
        const exact = x === 30 ? '1' : x === 45 ? '\\frac{\\sqrt2}{2}' : '\\frac{\\sqrt3-1}{2}';
        return q('trigonometry', level, mode, `Use CAS exact-value tools to evaluate \\(\\sin(${x}^\\circ)+\\cos(${2 * x}^\\circ)\\), then verify the result using a related-angle identity.`, `\\(${exact}\\approx${val.toFixed(4)}\\).`, [`Evaluate both terms in exact degree mode.`, `Apply \\(\\cos(2x)=1-2\\sin^2x\\) as an independent check.`, `For \\(x=${x}^\\circ\\), simplify to \\(${exact}\\approx${val.toFixed(4)}\\).`]);
      }
      if (level === 2 && !cas) {
        return q('trigonometry', level, mode, `Solve \\(\\sin(2\\theta)=\\cos\\theta\\) for \\(0\\le\\theta<2\\pi\\). Give every solution exactly and show how you handle the factor that may be zero.`, `\\(\\theta=\\frac{\\pi}{2},\\frac{3\\pi}{2},\\frac{\\pi}{6},\\frac{5\\pi}{6}\\).`, [`Use \\(\\sin(2\\theta)=2\\sin\\theta\\cos\\theta\\).`, `Then \\(\\cos\\theta(2\\sin\\theta-1)=0\\).`, `From \\(\\cos\\theta=0\\): \\(\\theta=\\pi/2,3\\pi/2\\). From \\(\\sin\\theta=1/2\\): \\(\\theta=\\pi/6,5\\pi/6\\).`, `Combine both sets; never divide through by \\(\\cos\\theta\\) without checking its zero case.`]);
      }
      if (level === 2) {
        return q('trigonometry', level, mode, `Use CAS graph/solve tools to find all roots of \\(2\\sin(2\\theta)=-\\cos\\theta\\) on \\(0\\le\\theta<2\\pi\\), then verify the count algebraically.`, `\\(\\theta=\\frac{\\pi}{2},\\frac{3\\pi}{2},\\pi+\\arcsin(1/4),2\\pi-\\arcsin(1/4)\\).`, [`Move all terms to one side: \\(2\\sin(2\\theta)+\\cos\\theta=0\\).`, `Factor using the double-angle identity: \\(\\cos\\theta(4\\sin\\theta+1)=0\\).`, `Solve \\(\\cos\\theta=0\\), then solve \\(\\sin\\theta=-1/4\\) in the interval.`, `Substitute all four roots into the original equation.`]);
      }
      if (level === 3 && !cas) {
        return q('trigonometry', level, mode, `Prove the identity \\(\\frac{\\sin(3x)}{\\sin x}=1+2\\cos(2x)\\) for \\(\\sin x\\ne0\\), then solve \\(\\sin(3x)=\\sin x\\) on \\(0\\le x<2\\pi\\).`, `Solutions: \\(x=0,\\frac{\\pi}{2},\\pi,\\frac{3\\pi}{2}\\) (with endpoints handled directly).`, [`Use \\(\\sin(3x)=3\\sin x-4\\sin^3x\\), then divide by \\(\\sin x\\) only when nonzero.`, `Obtain \\(3-4\\sin^2x=1+2\\cos(2x)\\) using \\(\\cos(2x)=1-2\\sin^2x\\).`, `For the equation, use \\(\\sin(3x)-\\sin x=2\\cos(2x)\\sin x=0\\).`, `Thus \\(\\sin x=0\\) or \\(\\cos(2x)=0\\); list all interval solutions and verify them in the original equation.`]);
      }
      return q('trigonometry', level, mode, `For \\(\\sin(2x)=a\\cos x\\) on \\(0\\le x<2\\pi\\), use CAS graph/solve tools and exact reasoning to determine the values of parameter \\(a\\) for which there are exactly four distinct solutions.`, `Exactly four solutions when \\(-2<a<2\\). At \\(a=\\pm2\\), only two distinct solutions remain; outside that range there are also two.`, [`Factor the equation: \\(\\cos x(2\\sin x-a)=0\\).`, `The first factor always gives \\(x=\\pi/2,3\\pi/2\\).`, `The second factor gives solutions only when \\(|a/2|\\le1\\); for \\(|a|<2\\) these are two additional angles, distinct from the first pair.`, `At \\(a=\\pm2\\), the additional sine solution coincides with one of the cosine roots, leaving two distinct roots. Therefore exactly four occur for \\(-2<a<2\\).`]);
    }
  };

  function generate(topic, difficulty, mode) {
    const level = levels.indexOf(difficulty);
    if (!bank[topic] || level < 0 || !['cas', 'noncas'].includes(mode)) throw new Error('Unknown question category');
    return bank[topic](level, mode);
  }
  window.SpecialistQuestionBank = { generate, topics: Object.keys(bank), levels };
})();
