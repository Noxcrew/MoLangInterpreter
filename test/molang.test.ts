import {expect} from 'chai';
import 'mocha';
import MoLang from '../src/molang';
import {FloatVariable} from "../src/variables";

describe('Arithmetic', () => {
	it('has the right operator precedence', () => {
		const result = new MoLang().evaluate(
			"10 + 3 * 4 - 3 * (2 + 9)");
		expect(result).to.equal(10 + 3 * 4 - 3 * (2 + 9));
	});
});

describe('Function calls', () => {
	it('supports builtin functions', () => {
		const result = new MoLang().evaluate(
			"Math.sin(1)");
		expect(result).to.equal(Math.sin(1));
	})
});

describe('Assignment', () => {
	it('correctly resolves expressions that return variables', () => {
		const m = new MoLang({
			x: new FloatVariable(0),
			y: new FloatVariable(0)
		});
		m.evaluate(
			"10 + 3 > 10 ? variable.x : variable.y = 1"
		);

		expect(m.getVariable("x")).to.equal(1);
		expect(m.getVariable("y")).to.equal(0);
	})
});

describe('Complex expressions', () => {
	it('correctly uses temporary variables', () => {
		const m = new MoLang({
			random_1: new FloatVariable(Math.random()),
			random_2: new FloatVariable(Math.random())
		});

		const result = m.evaluate(`
			temp.sign = variable.random_1 > 0.5 ? 1 : -1;
			return temp.sign * Math.sin(variable.random_2);
		`);

		const sign = <number>m.getVariable("random_1") > 0.5 ? 1 : -1;
		const expected = sign * Math.sin(<number>m.getVariable("random_2"));

		expect(result).to.equal(expected);
	})
});