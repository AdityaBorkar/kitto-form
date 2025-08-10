[**kitto-form**](../README.md)

***

# Class: KittoForm

Defined in: [form.ts:6](https://github.com/AdityaBorkar/kitto-form/blob/88f3c22b744b7ae928f92486198c9797a6dc60ee/src/form.ts#L6)

biome-ignore-all lint/performance/noBarrelFile: THIS IS A LIBRARY

## Constructors

### Constructor

> **new KittoForm**(`selector`): `KittoForm`

Defined in: [form.ts:9](https://github.com/AdityaBorkar/kitto-form/blob/88f3c22b744b7ae928f92486198c9797a6dc60ee/src/form.ts#L9)

#### Parameters

##### selector

`string`

#### Returns

`KittoForm`

## Methods

### element()

#### Call Signature

> **element**(`component`): `ComponentBuilder`

Defined in: [form.ts:41](https://github.com/AdityaBorkar/kitto-form/blob/88f3c22b744b7ae928f92486198c9797a6dc60ee/src/form.ts#L41)

##### Parameters

###### component

`` `@${string}` ``

##### Returns

`ComponentBuilder`

#### Call Signature

> **element**(`selector`): `DomElementHandle`

Defined in: [form.ts:42](https://github.com/AdityaBorkar/kitto-form/blob/88f3c22b744b7ae928f92486198c9797a6dc60ee/src/form.ts#L42)

##### Parameters

###### selector

`string`

##### Returns

`DomElementHandle`

***

### field()

> **field**\<`T`\>(`name`): `FieldBuilder`\<`T`\>

Defined in: [form.ts:17](https://github.com/AdityaBorkar/kitto-form/blob/88f3c22b744b7ae928f92486198c9797a6dc60ee/src/form.ts#L17)

#### Type Parameters

##### T

`T` = `string`

#### Parameters

##### name

`string`

#### Returns

`FieldBuilder`\<`T`\>

***

### slot()

> **slot**(`name`): `SlotHandle`

Defined in: [form.ts:37](https://github.com/AdityaBorkar/kitto-form/blob/88f3c22b744b7ae928f92486198c9797a6dc60ee/src/form.ts#L37)

#### Parameters

##### name

`string`

#### Returns

`SlotHandle`
