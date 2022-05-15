import { describe, it, expect } from "vitest";
import { mount } from '@vue/test-utils'
import FieldNumber from './FieldNumber.vue'


const mountComponent = (props: object) => {
    return mount(FieldNumber, {props});
}

describe('FieldNumber', () => {
    it('renders an input', () => {
        const wrapper = mountComponent({});
        expect(wrapper.find('input').exists()).toBe(true);
    });
    it('emits numbers when you type numbers', ()=>{
        const wrapper = mountComponent({});
        wrapper.find('input').setValue('1');
        expect(wrapper.emitted()['update:modelValue']).toEqual([[1]]);
    })
    it('emits undefined when field is cleared', ()=>{
        const wrapper = mountComponent({});
        wrapper.find('input').setValue('');
        expect(wrapper.emitted()['update:modelValue']).toEqual([[undefined]]);
    })
})
