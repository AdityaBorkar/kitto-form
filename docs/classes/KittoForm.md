[**kitto-form**](../README.md)

***

# Class: KittoForm

Defined in: [form.ts:147](https://github.com/AdityaBorkar/kitto-form/blob/22d98d5e6f85ccd55e4d9adb38a97acbb877f9bf/src/form.ts#L147)

Dynamic form rendering system with reactive field binding

## Constructors

### Constructor

> **new KittoForm**(`selector`): `KittoForm`

Defined in: [form.ts:151](https://github.com/AdityaBorkar/kitto-form/blob/22d98d5e6f85ccd55e4d9adb38a97acbb877f9bf/src/form.ts#L151)

Creates a KittoForm bound to a DOM element

#### Parameters

##### selector

`string`

#### Returns

`KittoForm`

## Methods

### field()

> **field**\<`T`\>(`name`): `FormBuilder`\<`T`\>

Defined in: [form.ts:160](https://github.com/AdityaBorkar/kitto-form/blob/22d98d5e6f85ccd55e4d9adb38a97acbb877f9bf/src/form.ts#L160)

Creates a FormBuilder for a field with the given name

#### Type Parameters

##### T

`T` = `any`

#### Parameters

##### name

`string`

#### Returns

`FormBuilder`\<`T`\>
