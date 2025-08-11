[**kitto-form**](../README.md)

***

# Class: KittoForm

Defined in: [form.ts:7](https://github.com/AdityaBorkar/kitto-form/blob/8f3e13e64442fd68dccb50e7e04151988bc51e95/src/form.ts#L7)

biome-ignore-all lint/performance/noBarrelFile: THIS IS A LIBRARY

## Constructors

### Constructor

> **new KittoForm**(`selector`): `KittoForm`

Defined in: [form.ts:10](https://github.com/AdityaBorkar/kitto-form/blob/8f3e13e64442fd68dccb50e7e04151988bc51e95/src/form.ts#L10)

#### Parameters

##### selector

`string`

#### Returns

`KittoForm`

## Methods

### element()

#### Call Signature

> **element**(`component`): `ComponentElement`

Defined in: [form.ts:48](https://github.com/AdityaBorkar/kitto-form/blob/8f3e13e64442fd68dccb50e7e04151988bc51e95/src/form.ts#L48)

##### Parameters

###### component

`` `@${string}` ``

##### Returns

`ComponentElement`

#### Call Signature

> **element**(`selector`): `DomElement`

Defined in: [form.ts:49](https://github.com/AdityaBorkar/kitto-form/blob/8f3e13e64442fd68dccb50e7e04151988bc51e95/src/form.ts#L49)

##### Parameters

###### selector

`string`

##### Returns

`DomElement`

***

### field()

> **field**\<`T`\>(`name`): `FieldBuilder`\<`T`\>

Defined in: [form.ts:25](https://github.com/AdityaBorkar/kitto-form/blob/8f3e13e64442fd68dccb50e7e04151988bc51e95/src/form.ts#L25)

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

> **slot**(`name`): `SlotElement`

Defined in: [form.ts:44](https://github.com/AdityaBorkar/kitto-form/blob/8f3e13e64442fd68dccb50e7e04151988bc51e95/src/form.ts#L44)

#### Parameters

##### name

`string`

#### Returns

`SlotElement`
