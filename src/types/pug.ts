export type AstNode =
  | Block
  | NamedBlock
  | MixinBlock
  | YieldBlock
  | Extends
  | Include
  | FileReference
  | IncludeFilter
  | Case
  | When
  | Conditional
  | While
  | Code
  | BlockComment
  | Comment
  | Doctype
  | Filter
  | Tag
  | InterpolatedTag
  | Mixin
  | Each
  | EachOf
  | Text
  | Attribute
  | AttributeBlock

interface AstNodeCommon {
  line:      number
  column?:   number
  filename?: string
}

export interface Block extends AstNodeCommon {
  type:  'Block'
  nodes: AstNode[]
}

export interface NamedBlock extends Omit<Block, 'type'> {
  type:  'NamedBlock'
  name:  string
  mode?: string
}

export interface MixinBlock extends AstNodeCommon {
  type: 'MixinBlock'
}

export interface YieldBlock extends AstNodeCommon {
  type: 'YieldBlock'
}

export interface Extends extends AstNodeCommon {
  type: 'Extends'
  file: FileReference
}

export interface Include extends AstNodeCommon {
  type:     'Include' | 'RawInclude'
  file:     FileReference
  filters?: IncludeFilter[]
  block?:   Block
}

export interface FileReference extends AstNodeCommon {
  type: 'FileReference'
  path: string
}

export interface IncludeFilter extends AstNodeCommon {
  type:  'IncludeFilter'
  name:  string
  attrs: Attribute[]
}

export interface Case extends AstNodeCommon {
  type:  'Case'
  expr:  string
  block: Block
}

export interface When extends AstNodeCommon {
  type:   'When'
  expr:   string
  block?: Block
  debug:  boolean
}

export interface Conditional extends AstNodeCommon {
  type:       'Conditional'
  test:       string
  consequent: Block
  alternate?: Conditional | Block
}

export interface While extends AstNodeCommon {
  type:  'While'
  test:  string
  block: Block
}

export interface Code extends AstNodeCommon {
  type:       'Code'
  val:        string
  buffer:     boolean
  mustEscape: boolean
  isInline:   boolean
  block?:     Block
}

export interface BlockComment extends AstNodeCommon {
  type:   'BlockComment'
  val:    string
  block:  Block
  buffer: boolean
}

export interface Comment extends AstNodeCommon {
  type:   'Comment'
  val:    string
  buffer: boolean
}

export interface Doctype extends AstNodeCommon {
  type: 'Doctype'
  val:  string
}

export interface Filter extends AstNodeCommon {
  type:  'Filter'
  name:  string
  block: Block
  attrs: Attribute[]
}

export interface Tag extends AstNodeCommon {
  type:            'Tag'
  name:            string
  selfClosing:     boolean
  block:           Block
  attrs:           Attribute[]
  attributeBlocks: AttributeBlock[]
  isInline:        boolean
  textOnly?:       boolean
}

export interface InterpolatedTag extends AstNodeCommon {
  type:            'InterpolatedTag'
  expr:            string
  selfClosing:     boolean
  block:           Block
  attrs:           Attribute[]
  attributeBlocks: AttributeBlock[]
  isInline:        boolean
}

export interface Mixin extends AstNodeCommon {
  type:            'Mixin'
  name:            string
  args:            string
  block:           Block
  call:            boolean
  attrs:           Attribute[]
  attributeBlocks: AttributeBlock[]
}

export interface Each extends AstNodeCommon {
  type:       'Each'
  obj:        string
  val:        string
  key?:       string
  block:      Block
  alternate?: Block
}

export interface EachOf extends AstNodeCommon {
  type:  'EachOf'
  obj:   string
  val:   string
  block: Block
}

export interface Text extends AstNodeCommon {
  type: 'Text'
  val:  string
}

export interface Attribute extends AstNodeCommon {
  type:       'Attribute'
  name:       string
  val:        string
  mustEscape: boolean
}

export interface AttributeBlock extends AstNodeCommon {
  type: 'AttributeBlock'
  val:  string
}
