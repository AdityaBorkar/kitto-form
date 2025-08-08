[**kitto-form**](../README.md)

***

# Class: Variable\<T\>

Defined in: [variable.ts:13](https://github.com/AdityaBorkar/kitto-form/blob/8d9171e954dd0db9f50609b9dbbaed19a33a5320/src/variable.ts#L13)

Reactive variable that binds to DOM elements with type-safe transformations

## Type Parameters

### T

`T`

## Constructors

### Constructor

> **new Variable**\<`T`\>(`selector`, `modifier?`): `Variable`\<`T`\>

Defined in: [variable.ts:19](https://github.com/AdityaBorkar/kitto-form/blob/8d9171e954dd0db9f50609b9dbbaed19a33a5320/src/variable.ts#L19)

Creates a Variable bound to a DOM element

#### Parameters

##### selector

`string` | `Element`

##### modifier?

`Modifier`\<`T`\>

#### Returns

`Variable`\<`T`\>

## Properties

### element

> **element**: `Element`

Defined in: [variable.ts:14](https://github.com/AdityaBorkar/kitto-form/blob/8d9171e954dd0db9f50609b9dbbaed19a33a5320/src/variable.ts#L14)

***

### modifier

> **modifier**: `Modifier`\<`T`\>

Defined in: [variable.ts:15](https://github.com/AdityaBorkar/kitto-form/blob/8d9171e954dd0db9f50609b9dbbaed19a33a5320/src/variable.ts#L15)

## Methods

### get()

> **get**(): `T`

Defined in: [variable.ts:36](https://github.com/AdityaBorkar/kitto-form/blob/8d9171e954dd0db9f50609b9dbbaed19a33a5320/src/variable.ts#L36)

Gets the current value from the bound element

#### Returns

`T`

***

### onChange()

> **onChange**(`callback`): `void`

Defined in: [variable.ts:65](https://github.com/AdityaBorkar/kitto-form/blob/8d9171e954dd0db9f50609b9dbbaed19a33a5320/src/variable.ts#L65)

Registers a callback to be called when the variable value changes

#### Parameters

##### callback

`Callback`\<`T`\>

#### Returns

`void`

***

### set()

> **set**(`value`): `void`

Defined in: [variable.ts:42](https://github.com/AdityaBorkar/kitto-form/blob/8d9171e954dd0db9f50609b9dbbaed19a33a5320/src/variable.ts#L42)

Sets the value of the bound element

#### Parameters

##### value

`T`

#### Returns

`void`

***

### computed()

> `static` **computed**\<`T`\>(`computeFn`, `dependencies`): `ComputedVariable`\<`T`\>

Defined in: [variable.ts:49](https://github.com/AdityaBorkar/kitto-form/blob/8d9171e954dd0db9f50609b9dbbaed19a33a5320/src/variable.ts#L49)

Creates a computed variable that derives its value from dependencies

#### Type Parameters

##### T

`T`

#### Parameters

##### computeFn

() => `T`

##### dependencies

`Variable`\<`any`\>[] = `[]`

#### Returns

`ComputedVariable`\<`T`\>
