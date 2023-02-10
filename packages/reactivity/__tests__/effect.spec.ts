import { effect } from "../src/effect"
import { reactive } from "../src/reactive"

describe('effect', () => {
  test('happy path',() => {
    const user = reactive({
      age: 10,
    })

    let nextAge
    effect(() => {
      nextAge = user.age + 1
    })
    
    expect(nextAge).toBe(11)
    
    // update
    user.age++
    expect(nextAge).toBe(12)
  })

  test('should return runner when call effect', () => {
    // 当调用 runner 的时候可以重新执行 effect.run
    // runner 的返回值就是用户给的 fn 的返回值
    let foo = 0
    const runner = effect(() => {
      foo++
      return 'foo'
    })

    expect(foo).toBe(1)
    const r = runner()
    expect(foo).toBe(2)
    expect(r).toBe('foo')
  })
})