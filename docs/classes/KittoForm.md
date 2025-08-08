[**kitto-form**](../README.md)

***

# Class: KittoForm

Defined in: [form.ts:156](https://github.com/AdityaBorkar/kitto-form/blob/8d9171e954dd0db9f50609b9dbbaed19a33a5320/src/form.ts#L156)

Dynamic form rendering system with reactive field binding

## Constructors

### Constructor

> **new KittoForm**(`selector`): `KittoForm`

Defined in: [form.ts:160](https://github.com/AdityaBorkar/kitto-form/blob/8d9171e954dd0db9f50609b9dbbaed19a33a5320/src/form.ts#L160)

Creates a KittoForm bound to a DOM element

#### Parameters

##### selector

`string`

#### Returns

`KittoForm`

## Methods

### field()

> **field**\<`T`\>(`name`): `FormBuilder`\<`T`\>

Defined in: [form.ts:169](https://github.com/AdityaBorkar/kitto-form/blob/8d9171e954dd0db9f50609b9dbbaed19a33a5320/src/form.ts#L169)

Creates a FormBuilder for a field with the given name

#### Type Parameters

##### T

`T` = `any`

#### Parameters

##### name

`string`

#### Returns

`FormBuilder`\<`T`\>
