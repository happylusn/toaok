
class A<T> {
  protected s = ''
  name1(a: T): T{
    console.log(1111)
    return a
  }
}
// // class B extends A{
// //   static name2() {
// //     console.log(2222)
// //   }
// // }
let s: keyof A<string> = 'name1'
const a1: A<string> = new A()
// a1.name1('ddd')
// a1.name1.apply()

// function f<T>(a: T): T {
//   return a
// }
interface Ag<T = string> {
  s: T
}

const r: Ag = {s: 'ss'}
