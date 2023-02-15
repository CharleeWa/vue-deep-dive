import { effect, stop } from "../src/effect"
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

  test("scheduler", () => {
    let dummy
    let run: any
    const scheduler = vi.fn(() => {
      run = runner
    })
    const obj = reactive({ foo: 1 })
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      { scheduler }
    )
    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)
    // should be called on first trigger
    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    // should not run yet
    expect(dummy).toBe(1)
    // // manually run
    run()
    // should have run
    expect(dummy).toBe(2)
  })

  test('stop', () => {
    let dummy
    const obj = reactive({ prop: 1 })
    const runner = effect(() => {
      dummy = obj.prop
    })
    obj.prop = 2
    expect(dummy).toBe(2)
    stop(runner)
    obj.prop = 3
    expect(dummy).toBe(2)

    // stopped effect should still be manually callable
    runner()
    expect(dummy).toBe(3)
  })
})