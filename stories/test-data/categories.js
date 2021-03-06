import { FieldTypeEnum, RuleTypeEnum } from 'nooket-common';

export const categories = [
  {
    _id: '5',
    icon: 'red-envelope',
    name: 'Message',
    description: 'Mensajes que un usuario puede enviar a otro',
    canBePrivate: true,
    privateToMentionPeople: false,
    fields: [
      {
        code: 'to',
        name: 'To',
        order: 0,
        layout: 1,
        description: 'recipient user',
        type: FieldTypeEnum.MENTION,
        rules: [
          {
            rule: RuleTypeEnum.REQUIRED,
            value: null,
            message: 'Field "to" is required',
          },
        ],
      },
      {
        code: 'cc',
        name: 'CC',
        order: 1,
        layout: 1,
        description: 'carbon copy',
        type: FieldTypeEnum.ARRAY_OF_MENTION,
        rules: [
          {
            rule: RuleTypeEnum.MIN_LENGTH,
            value: 0,
            message: null,
          },
          {
            rule: RuleTypeEnum.MAX_LENGTH,
            value: 5,
            message: 'max 5 recipients urser',
          },
        ],
      },
    ],
  },
  {
    _id: '1',
    icon: 'calendar',
    name: 'Event',
    description: 'Cualquier evento destacable',
    canBePrivate: true,
    privateToMentionPeople: false,
  },
  {
    _id: '2',
    icon: 'check-square',
    name: 'Task',
    description: 'Tareas que es necesario realizar',
    canBePrivate: true,
    privateToMentionPeople: false,
    fields: [
      {
        code: 'status',
        name: 'Status',
        order: 0,
        layout: 1,
        description: 'Status of the task',
        type: FieldTypeEnum.STRING,
        rules: [
          {
            rule: RuleTypeEnum.REQUIRED,
            value: null,
            message: 'Status is required',
          },
          {
            rule: RuleTypeEnum.ALLOWED_VALUES,
            value: 'pending, in progress, blocked, completed',
          },
        ],
      },
      {
        code: 'priority',
        name: 'Priority',
        order: 0,
        layout: 1,
        description: 'Priority of the task',
        type: FieldTypeEnum.STRING,
        rules: [
          {
            rule: RuleTypeEnum.ALLOWED_VALUES,
            value: 'hight,normal,low',
          },
        ],
      },
      {
        code: 'time',
        name: 'Time',
        order: 1,
        layout: 1,
        description: 'Estimated time',
        type: FieldTypeEnum.DECIMAL,
        rules: [
          {
            rule: RuleTypeEnum.MIN,
            value: 0.5,
            message: null,
          },
        ],
      },
      {
        code: 'releaseDate',
        name: 'Release date',
        order: 2,
        layout: 1,
        description: 'Release date',
        type: FieldTypeEnum.DATE,
      },
      {
        code: 'assignedTo',
        name: 'Assigned to',
        order: 3,
        layout: 1,
        description: 'Assigned to',
        type: FieldTypeEnum.MENTION,
      },
    ],
  },
  {
    _id: '3',
    icon: 'bulb',
    name: 'Idea',
    description: 'Ideas para compartir y discutir',
    canBePrivate: true,
    privateToMentionPeople: false,
  },
  {
    _id: '4',
    icon: 'scissor',
    name: 'Snippet',
    description: 'Pequeñas piezas de información',
    canBePrivate: true,
    privateToMentionPeople: false,
  },
  {
    _id: '6',
    isInternalActivity: true,
    icon: 'thunderbolt',
    name: 'Activity',
    description: 'User activity',
    canBePrivate: false,
    privateToMentionPeople: false,
    fields: [
      {
        code: 'action',
        name: 'Action',
        order: 0,
        layout: 1,
        description: 'Action type',
        type: FieldTypeEnum.STRING,
        rules: [
          {
            rule: RuleTypeEnum.REQUIRED,
            value: null,
            message: 'Action is required',
          },
          {
            rule: RuleTypeEnum.ALLOWED_VALUES,
            value: 'crate-new, update-field, delete, comment',
          },
        ],
      },
      {
        code: 'relatedIntance',
        name: 'Related Instance',
        order: 1,
        layout: 1,
        description: 'Intance which activity is related',
        type: FieldTypeEnum.REFERENCE,
      },
      {
        code: 'relatedInstanceType',
        name: 'Related Instance Type',
        order: 1,
        layout: 1,
        description: 'Intance type which activity is related',
        type: FieldTypeEnum.REFERENCE,
      },
      {
        code: 'relatedInstanceTitle',
        name: 'Related Instance title',
        order: 1,
        layout: 1,
        description: 'Intance type which activity is related',
        type: FieldTypeEnum.REFERENCE,
      },
    ],
  },
];
