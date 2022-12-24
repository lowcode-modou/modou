export const mock_datasources = {
  list: [],
  loading: false,
  isTesting: false,
  isListing: false,
  fetchingDatasourceStructure: false,
  isRefreshingStructure: false,
  structure: {},
  isFetchingMockDataSource: false,
  mockDatasourceList: [
    {
      pluginType: 'db',
      packageName: 'mongo-plugin',
      description: 'This contains a standard movies collection',
      name: 'movies',
    },
    {
      pluginType: 'db',
      packageName: 'postgres-plugin',
      description: 'This contains a standard users information',
      name: 'users',
    },
  ],
  executingDatasourceQuery: false,
  isReconnectingModalOpen: false,
  unconfiguredList: [],
  isDatasourceBeingSaved: false,
  isDatasourceBeingSavedFromPopup: false,
}

export const mock_dynamicData = {
  MainContainer: {
    defaultProps: {},
    defaultMetaProps: [],
    dynamicBindingPathList: [],
    logBlackList: {},
    bindingPaths: {},
    reactivePaths: {},
    triggerPaths: {},
    validationPaths: {},
    ENTITY_TYPE: 'WIDGET',
    privateWidgets: {},
    propertyOverrideDependency: {},
    overridingPropertyPaths: {},
    type: 'CANVAS_WIDGET',
    widgetName: 'MainContainer',
    backgroundColor: 'none',
    rightColumn: 4896,
    snapColumns: 64,
    widgetId: '0',
    topRow: 0,
    bottomRow: 1290,
    containerStyle: 'none',
    snapRows: 125,
    parentRowSpace: 1,
    canExtend: true,
    minHeight: 1292,
    parentColumnSpace: 1,
    leftColumn: 0,
    meta: {},
  },
  Button1: {
    defaultProps: {},
    defaultMetaProps: ['recaptchaToken'],
    dynamicBindingPathList: [
      {
        key: 'buttonColor',
      },
      {
        key: 'borderRadius',
      },
    ],
    logBlackList: {},
    bindingPaths: {
      text: 'TEMPLATE',
      tooltip: 'TEMPLATE',
      isVisible: 'TEMPLATE',
      isDisabled: 'TEMPLATE',
      animateLoading: 'TEMPLATE',
      googleRecaptchaKey: 'TEMPLATE',
      recaptchaType: 'TEMPLATE',
      disabledWhenInvalid: 'TEMPLATE',
      resetFormOnClick: 'TEMPLATE',
      buttonVariant: 'TEMPLATE',
      iconName: 'TEMPLATE',
      placement: 'TEMPLATE',
      buttonColor: 'TEMPLATE',
      borderRadius: 'TEMPLATE',
      boxShadow: 'TEMPLATE',
    },
    reactivePaths: {
      recaptchaToken: 'TEMPLATE',
      buttonColor: 'TEMPLATE',
      borderRadius: 'TEMPLATE',
      text: 'TEMPLATE',
      tooltip: 'TEMPLATE',
      isVisible: 'TEMPLATE',
      isDisabled: 'TEMPLATE',
      animateLoading: 'TEMPLATE',
      googleRecaptchaKey: 'TEMPLATE',
      recaptchaType: 'TEMPLATE',
      disabledWhenInvalid: 'TEMPLATE',
      resetFormOnClick: 'TEMPLATE',
      buttonVariant: 'TEMPLATE',
      iconName: 'TEMPLATE',
      placement: 'TEMPLATE',
      boxShadow: 'TEMPLATE',
    },
    triggerPaths: {
      onClick: true,
    },
    validationPaths: {
      text: {
        type: 'TEXT',
      },
      tooltip: {
        type: 'TEXT',
      },
      isVisible: {
        type: 'BOOLEAN',
      },
      isDisabled: {
        type: 'BOOLEAN',
      },
      animateLoading: {
        type: 'BOOLEAN',
      },
      googleRecaptchaKey: {
        type: 'TEXT',
      },
      recaptchaType: {
        type: 'TEXT',
        params: {
          allowedValues: ['V3', 'V2'],
          default: 'V3',
        },
      },
      disabledWhenInvalid: {
        type: 'BOOLEAN',
      },
      resetFormOnClick: {
        type: 'BOOLEAN',
      },
      buttonVariant: {
        type: 'TEXT',
        params: {
          allowedValues: ['PRIMARY', 'SECONDARY', 'TERTIARY'],
          default: 'PRIMARY',
        },
      },
      iconName: {
        type: 'TEXT',
      },
      placement: {
        type: 'TEXT',
        params: {
          allowedValues: ['START', 'BETWEEN', 'CENTER'],
          default: 'CENTER',
        },
      },
      buttonColor: {
        type: 'TEXT',
      },
      borderRadius: {
        type: 'TEXT',
      },
      boxShadow: {
        type: 'TEXT',
      },
    },
    ENTITY_TYPE: 'WIDGET',
    privateWidgets: {},
    propertyOverrideDependency: {},
    overridingPropertyPaths: {},
    type: 'BUTTON_WIDGET',
    dynamicPropertyPathList: [],
    dynamicTriggerPathList: [],
    resetFormOnClick: false,
    boxShadow: 'none',
    widgetName: 'Button1',
    onClick: '',
    buttonColor: '#16a34a',
    topRow: 20,
    bottomRow: 24,
    parentRowSpace: 10,
    animateLoading: true,
    parentColumnSpace: 8.796875,
    leftColumn: 9,
    text: 'Submit-',
    isDisabled: false,
    key: 'l3ketcp1dr',
    rightColumn: 25,
    isDefaultClickDisabled: true,
    widgetId: 'g4ifgmw7bb',
    isVisible: true,
    recaptchaType: 'V3',
    isLoading: false,
    disabledWhenInvalid: false,
    borderRadius: '0px',
    buttonVariant: 'PRIMARY',
    placement: 'CENTER',
    meta: {},
    tooltip: '',
    googleRecaptchaKey: '',
    iconName: '',
    __evaluation__: {
      errors: {
        text: [],
        borderRadius: [],
        buttonColor: [],
      },
      evaluatedValues: {
        text: 'Submit-',
        borderRadius: '0px',
        buttonColor: '#16a34a',
        tooltip: '',
        isVisible: true,
        isDisabled: false,
        animateLoading: true,
        googleRecaptchaKey: '',
        recaptchaType: 'V3',
        disabledWhenInvalid: false,
        resetFormOnClick: false,
        buttonVariant: 'PRIMARY',
        iconName: '',
        placement: 'CENTER',
        boxShadow: 'none',
      },
    },
  },
  Input1: {
    defaultProps: {
      inputText: 'defaultText',
      text: 'defaultText',
    },
    defaultMetaProps: ['text', 'isFocused', 'isDirty', 'inputText'],
    dynamicBindingPathList: [
      {
        key: 'accentColor',
      },
      {
        key: 'borderRadius',
      },
      {
        key: 'label',
      },
      {
        key: 'value',
      },
      {
        key: 'isValid',
      },
    ],
    logBlackList: {
      value: true,
      isValid: true,
    },
    bindingPaths: {
      defaultText: 'TEMPLATE',
      label: 'TEMPLATE',
      isRequired: 'TEMPLATE',
      maxChars: 'TEMPLATE',
      regex: 'TEMPLATE',
      validation: 'TEMPLATE',
      errorMessage: 'TEMPLATE',
      isSpellCheck: 'TEMPLATE',
      tooltip: 'TEMPLATE',
      placeholderText: 'TEMPLATE',
      isVisible: 'TEMPLATE',
      isDisabled: 'TEMPLATE',
      animateLoading: 'TEMPLATE',
      autoFocus: 'TEMPLATE',
      resetOnSubmit: 'TEMPLATE',
      iconName: 'TEMPLATE',
      labelTextColor: 'TEMPLATE',
      labelTextSize: 'TEMPLATE',
      labelStyle: 'TEMPLATE',
      accentColor: 'TEMPLATE',
      borderRadius: 'TEMPLATE',
      boxShadow: 'TEMPLATE',
    },
    reactivePaths: {
      value: 'TEMPLATE',
      isValid: 'TEMPLATE',
      text: 'TEMPLATE',
      isFocused: 'TEMPLATE',
      isDirty: 'TEMPLATE',
      inputText: 'TEMPLATE',
      accentColor: 'TEMPLATE',
      borderRadius: 'TEMPLATE',
      label: 'TEMPLATE',
      defaultText: 'TEMPLATE',
      'meta.inputText': 'TEMPLATE',
      'meta.text': 'TEMPLATE',
      isRequired: 'TEMPLATE',
      maxChars: 'TEMPLATE',
      regex: 'TEMPLATE',
      validation: 'TEMPLATE',
      errorMessage: 'TEMPLATE',
      isSpellCheck: 'TEMPLATE',
      tooltip: 'TEMPLATE',
      placeholderText: 'TEMPLATE',
      isVisible: 'TEMPLATE',
      isDisabled: 'TEMPLATE',
      animateLoading: 'TEMPLATE',
      autoFocus: 'TEMPLATE',
      resetOnSubmit: 'TEMPLATE',
      iconName: 'TEMPLATE',
      labelTextColor: 'TEMPLATE',
      labelTextSize: 'TEMPLATE',
      labelStyle: 'TEMPLATE',
      boxShadow: 'TEMPLATE',
    },
    triggerPaths: {
      onTextChanged: true,
      onFocus: true,
      onBlur: true,
      onSubmit: true,
    },
    validationPaths: {
      defaultText: {
        type: 'FUNCTION',
        params: {
          expected: {
            type: 'string or number',
            example: 'John | 123',
            autocompleteDataType: 'STRING',
          },
          fnString:
            'function defaultValueValidation(value, props, _) {\n  var STRING_ERROR_MESSAGE = "This value must be string";\n  var NUMBER_ERROR_MESSAGE = "This value must be number";\n  var EMPTY_ERROR_MESSAGE = "";\n\n  if (_.isObject(value)) {\n    return {\n      isValid: false,\n      parsed: JSON.stringify(value, null, 2),\n      messages: [STRING_ERROR_MESSAGE]\n    };\n  }\n\n  var inputType = props.inputType;\n  var parsed;\n\n  switch (inputType) {\n    case "NUMBER":\n      if (_.isNil(value)) {\n        parsed = null;\n      } else {\n        parsed = Number(value);\n      }\n\n      var isValid, messages;\n\n      if (_.isString(value) && value.trim() === "") {\n        /*\n         *  When value is emtpy string\n         */\n        isValid = true;\n        messages = [EMPTY_ERROR_MESSAGE];\n        parsed = null;\n      } else if (!Number.isFinite(parsed)) {\n        /*\n         *  When parsed value is not a finite numer\n         */\n        isValid = false;\n        messages = [NUMBER_ERROR_MESSAGE];\n        parsed = null;\n      } else {\n        /*\n         *  When parsed value is a Number\n         */\n        isValid = true;\n        messages = [EMPTY_ERROR_MESSAGE];\n      }\n\n      return {\n        isValid: isValid,\n        parsed: parsed,\n        messages: messages\n      };\n\n    case "TEXT":\n    case "PASSWORD":\n    case "EMAIL":\n      parsed = value;\n\n      if (!_.isString(parsed)) {\n        try {\n          parsed = _.toString(parsed);\n        } catch (e) {\n          return {\n            isValid: false,\n            parsed: "",\n            messages: [STRING_ERROR_MESSAGE]\n          };\n        }\n      }\n\n      return {\n        isValid: _.isString(parsed),\n        parsed: parsed,\n        messages: [EMPTY_ERROR_MESSAGE]\n      };\n\n    default:\n      return {\n        isValid: false,\n        parsed: "",\n        messages: [STRING_ERROR_MESSAGE]\n      };\n  }\n}',
        },
      },
      label: {
        type: 'TEXT',
      },
      isRequired: {
        type: 'BOOLEAN',
      },
      maxChars: {
        type: 'NUMBER',
        params: {
          min: 1,
          natural: true,
          passThroughOnZero: false,
        },
      },
      regex: {
        type: 'REGEX',
      },
      validation: {
        type: 'BOOLEAN',
        params: {
          default: true,
        },
      },
      errorMessage: {
        type: 'TEXT',
      },
      isSpellCheck: {
        type: 'BOOLEAN',
      },
      tooltip: {
        type: 'TEXT',
      },
      placeholderText: {
        type: 'TEXT',
      },
      isVisible: {
        type: 'BOOLEAN',
      },
      isDisabled: {
        type: 'BOOLEAN',
      },
      animateLoading: {
        type: 'BOOLEAN',
      },
      autoFocus: {
        type: 'BOOLEAN',
      },
      resetOnSubmit: {
        type: 'BOOLEAN',
      },
      iconName: {
        type: 'TEXT',
        params: {
          allowedValues: [
            'add',
            'add-column-left',
            'add-column-right',
            'add-row-bottom',
            'add-row-top',
            'add-to-artifact',
            'add-to-folder',
            'airplane',
            'alignment-bottom',
            'alignment-horizontal-center',
            'alignment-left',
            'alignment-right',
            'alignment-top',
            'alignment-vertical-center',
            'align-center',
            'align-justify',
            'align-left',
            'align-right',
            'annotation',
            'application',
            'applications',
            'app-header',
            'archive',
            'array',
            'array-boolean',
            'array-date',
            'array-numeric',
            'array-string',
            'array-timestamp',
            'arrows-horizontal',
            'arrows-vertical',
            'arrow-bottom-left',
            'arrow-bottom-right',
            'arrow-down',
            'arrow-left',
            'arrow-right',
            'arrow-top-left',
            'arrow-top-right',
            'arrow-up',
            'asterisk',
            'automatic-updates',
            'backlink',
            'badge',
            'bank-account',
            'ban-circle',
            'barcode',
            'blank',
            'blocked-person',
            'bold',
            'book',
            'bookmark',
            'box',
            'briefcase',
            'bring-data',
            'build',
            'calculator',
            'calendar',
            'camera',
            'caret-down',
            'caret-left',
            'caret-right',
            'caret-up',
            'cell-tower',
            'changes',
            'chart',
            'chat',
            'chevron-backward',
            'chevron-down',
            'chevron-forward',
            'chevron-left',
            'chevron-right',
            'chevron-up',
            'circle',
            'circle-arrow-down',
            'circle-arrow-left',
            'circle-arrow-right',
            'circle-arrow-up',
            'citation',
            'clean',
            'clipboard',
            'cloud',
            'cloud-download',
            'cloud-upload',
            'code',
            'code-block',
            'cog',
            'collapse-all',
            'column-layout',
            'comment',
            'comparison',
            'compass',
            'compressed',
            'confirm',
            'console',
            'contrast',
            'control',
            'credit-card',
            'cross',
            'crown',
            'cube',
            'cube-add',
            'cube-remove',
            'curved-range-chart',
            'cut',
            'cycle',
            'dashboard',
            'database',
            'data-connection',
            'data-lineage',
            'delete',
            'delta',
            'derive-column',
            'desktop',
            'diagnosis',
            'diagram-tree',
            'direction-left',
            'direction-right',
            'disable',
            'document',
            'document-open',
            'document-share',
            'dollar',
            'dot',
            'double-caret-horizontal',
            'double-caret-vertical',
            'double-chevron-down',
            'double-chevron-left',
            'double-chevron-right',
            'double-chevron-up',
            'doughnut-chart',
            'download',
            'drag-handle-horizontal',
            'drag-handle-vertical',
            'draw',
            'drawer-left',
            'drawer-left-filled',
            'drawer-right',
            'drawer-right-filled',
            'drive-time',
            'duplicate',
            'edit',
            'eject',
            'endorsed',
            'envelope',
            'equals',
            'eraser',
            'error',
            'euro',
            'exchange',
            'exclude-row',
            'expand-all',
            'export',
            'eye-off',
            'eye-on',
            'eye-open',
            'fast-backward',
            'fast-forward',
            'feed',
            'feed-subscribed',
            'film',
            'filter',
            'filter-keep',
            'filter-list',
            'filter-open',
            'filter-remove',
            'flag',
            'flame',
            'flash',
            'floppy-disk',
            'flows',
            'flow-branch',
            'flow-end',
            'flow-linear',
            'flow-review',
            'flow-review-branch',
            'folder-close',
            'folder-new',
            'folder-open',
            'folder-shared',
            'folder-shared-open',
            'follower',
            'following',
            'font',
            'fork',
            'form',
            'fullscreen',
            'full-circle',
            'full-stacked-chart',
            'function',
            'gantt-chart',
            'geofence',
            'geolocation',
            'geosearch',
            'git-branch',
            'git-commit',
            'git-merge',
            'git-new-branch',
            'git-pull',
            'git-push',
            'git-repo',
            'glass',
            'globe',
            'globe-network',
            'graph',
            'graph-remove',
            'greater-than',
            'greater-than-or-equal-to',
            'grid',
            'grid-view',
            'grouped-bar-chart',
            'group-objects',
            'hand',
            'hand-down',
            'hand-left',
            'hand-right',
            'hand-up',
            'hat',
            'header',
            'header-one',
            'header-two',
            'headset',
            'heart',
            'heart-broken',
            'heatmap',
            'heat-grid',
            'help',
            'helper-management',
            'highlight',
            'history',
            'home',
            'horizontal-bar-chart',
            'horizontal-bar-chart-asc',
            'horizontal-bar-chart-desc',
            'horizontal-distribution',
            'id-number',
            'image-rotate-left',
            'image-rotate-right',
            'import',
            'inbox',
            'inbox-filtered',
            'inbox-geo',
            'inbox-search',
            'inbox-update',
            'info-sign',
            'inheritance',
            'inherited-group',
            'inner-join',
            'insert',
            'intersection',
            'ip-address',
            'issue',
            'issue-closed',
            'issue-new',
            'italic',
            'join-table',
            'key',
            'key-backspace',
            'key-command',
            'key-control',
            'key-delete',
            'key-enter',
            'key-escape',
            'key-option',
            'key-shift',
            'key-tab',
            'known-vehicle',
            'label',
            'lab-test',
            'layer',
            'layers',
            'layout',
            'layout-auto',
            'layout-balloon',
            'layout-circle',
            'layout-grid',
            'layout-group-by',
            'layout-hierarchy',
            'layout-linear',
            'layout-skew-grid',
            'layout-sorted-clusters',
            'learning',
            'left-join',
            'less-than',
            'less-than-or-equal-to',
            'lifesaver',
            'lightbulb',
            'link',
            'list',
            'list-columns',
            'list-detail-view',
            'locate',
            'lock',
            'log-in',
            'log-out',
            'manual',
            'manually-entered-data',
            'map',
            'map-create',
            'map-marker',
            'maximize',
            'media',
            'menu',
            'menu-closed',
            'menu-open',
            'merge-columns',
            'merge-links',
            'minimize',
            'minus',
            'mobile-phone',
            'mobile-video',
            'modal',
            'modal-filled',
            'moon',
            'more',
            'mountain',
            'move',
            'mugshot',
            'multi-select',
            'music',
            'new-drawing',
            'new-grid-item',
            'new-layer',
            'new-layers',
            'new-link',
            'new-object',
            'new-person',
            'new-prescription',
            'new-text-box',
            'ninja',
            'notifications',
            'notifications-updated',
            'not-equal-to',
            'numbered-list',
            'numerical',
            'office',
            'offline',
            'oil-field',
            'one-column',
            'outdated',
            'page-layout',
            'panel-stats',
            'panel-table',
            'paperclip',
            'paragraph',
            'path',
            'path-search',
            'pause',
            'people',
            'percentage',
            'person',
            'phone',
            'pie-chart',
            'pin',
            'pivot',
            'pivot-table',
            'play',
            'plus',
            'polygon-filter',
            'power',
            'predictive-analysis',
            'prescription',
            'presentation',
            'print',
            'projects',
            'properties',
            'property',
            'publish-function',
            'pulse',
            'random',
            'record',
            'redo',
            'refresh',
            'regression-chart',
            'remove',
            'remove-column',
            'remove-column-left',
            'remove-column-right',
            'remove-row-bottom',
            'remove-row-top',
            'repeat',
            'reset',
            'resolve',
            'rig',
            'right-join',
            'ring',
            'rotate-document',
            'rotate-page',
            'route',
            'satellite',
            'saved',
            'scatter-plot',
            'search',
            'search-around',
            'search-template',
            'search-text',
            'segmented-control',
            'select',
            'selection',
            'send-message',
            'send-to',
            'send-to-graph',
            'send-to-map',
            'series-add',
            'series-configuration',
            'series-derived',
            'series-filtered',
            'series-search',
            'settings',
            'share',
            'shield',
            'shop',
            'shopping-cart',
            'signal-search',
            'sim-card',
            'slash',
            'small-cross',
            'small-minus',
            'small-plus',
            'small-tick',
            'snowflake',
            'social-media',
            'sort',
            'sort-alphabetical',
            'sort-alphabetical-desc',
            'sort-asc',
            'sort-desc',
            'sort-numerical',
            'sort-numerical-desc',
            'split-columns',
            'square',
            'stacked-chart',
            'star',
            'star-empty',
            'step-backward',
            'step-chart',
            'step-forward',
            'stop',
            'stopwatch',
            'strikethrough',
            'style',
            'swap-horizontal',
            'swap-vertical',
            'switch',
            'symbol-circle',
            'symbol-cross',
            'symbol-diamond',
            'symbol-square',
            'symbol-triangle-down',
            'symbol-triangle-up',
            'tag',
            'take-action',
            'taxi',
            'text-highlight',
            'th',
            'thumbs-down',
            'thumbs-up',
            'th-derived',
            'th-disconnect',
            'th-filtered',
            'th-list',
            'tick',
            'tick-circle',
            'time',
            'timeline-area-chart',
            'timeline-bar-chart',
            'timeline-events',
            'timeline-line-chart',
            'tint',
            'torch',
            'tractor',
            'train',
            'translate',
            'trash',
            'tree',
            'trending-down',
            'trending-up',
            'truck',
            'two-columns',
            'unarchive',
            'underline',
            'undo',
            'ungroup-objects',
            'unknown-vehicle',
            'unlock',
            'unpin',
            'unresolve',
            'updated',
            'upload',
            'user',
            'variable',
            'vertical-bar-chart-asc',
            'vertical-bar-chart-desc',
            'vertical-distribution',
            'video',
            'virus',
            'volume-down',
            'volume-off',
            'volume-up',
            'walk',
            'warning-sign',
            'waterfall-chart',
            'widget',
            'widget-button',
            'widget-footer',
            'widget-header',
            'wrench',
            'zoom-in',
            'zoom-out',
            'zoom-to-fit',
          ],
        },
      },
      labelTextColor: {
        type: 'TEXT',
        params: {
          regex: {},
        },
      },
      labelTextSize: {
        type: 'TEXT',
      },
      labelStyle: {
        type: 'TEXT',
      },
      accentColor: {
        type: 'TEXT',
      },
      borderRadius: {
        type: 'TEXT',
      },
      boxShadow: {
        type: 'TEXT',
      },
    },
    ENTITY_TYPE: 'WIDGET',
    privateWidgets: {},
    propertyOverrideDependency: {
      inputText: {
        DEFAULT: 'defaultText',
        META: 'meta.inputText',
      },
      text: {
        DEFAULT: 'defaultText',
        META: 'meta.text',
      },
    },
    overridingPropertyPaths: {
      defaultText: ['inputText', 'meta.inputText', 'text', 'meta.text'],
      'meta.inputText': ['inputText'],
      'meta.text': ['text'],
    },
    type: 'INPUT_WIDGET_V2',
    dynamicTriggerPathList: [],
    boxShadow: 'none',
    widgetName: 'Input1',
    topRow: 7,
    bottomRow: 14,
    parentRowSpace: 10,
    labelWidth: 5,
    autoFocus: false,
    animateLoading: true,
    parentColumnSpace: 8.796875,
    resetOnSubmit: true,
    leftColumn: 9,
    labelPosition: 'Top',
    labelStyle: '',
    inputType: 'TEXT',
    isDisabled: false,
    key: '6b2fsum6vi',
    labelTextSize: '0.875rem',
    isRequired: false,
    rightColumn: 29,
    dynamicHeight: 'FIXED',
    widgetId: 't9k6lh9yr2',
    accentColor: '#16a34a',
    isVisible: true,
    label: 'Label-Lei Liu',
    labelAlignment: 'left',
    isLoading: false,
    borderRadius: '0px',
    maxDynamicHeight: 9000,
    iconAlign: 'left',
    defaultText: '',
    minDynamicHeight: 4,
    value: '',
    isValid: true,
    text: '',
    isFocused: false,
    isDirty: false,
    inputText: '',
    meta: {
      text: '',
      inputText: '',
    },
    regex: '',
    validation: true,
    errorMessage: '',
    tooltip: '',
    placeholderText: '',
    iconName: '',
    labelTextColor: '',
    __evaluation__: {
      errors: {
        'meta.text': [],
        'meta.inputText': [],
        meta: [],
        isRequired: [],
        inputType: [],
        defaultText: [],
        inputText: [],
        isValid: [],
        text: [],
        value: [],
        label: [],
        borderRadius: [],
        accentColor: [],
      },
      evaluatedValues: {
        'meta.text': '',
        'meta.inputText': '',
        meta: {
          text: '',
          inputText: '',
        },
        isRequired: false,
        inputType: 'TEXT',
        defaultText: '',
        inputText: '',
        isValid: true,
        text: '',
        value: '',
        label: 'Label-Lei Liu',
        borderRadius: '0px',
        accentColor: '#16a34a',
        regex: '',
        validation: true,
        errorMessage: '',
        tooltip: '',
        placeholderText: '',
        isVisible: true,
        isDisabled: false,
        animateLoading: true,
        autoFocus: false,
        resetOnSubmit: true,
        iconName: '',
        labelTextColor: '',
        labelTextSize: '0.875rem',
        labelStyle: '',
        boxShadow: 'none',
      },
    },
  },
  pageList: {
    '0': {
      pageName: 'Page1',
      pageId: '63a210adcb0c41354d0ff125',
      isDefault: true,
      isHidden: false,
      slug: 'page1',
      userPermissions: [
        'read:pages',
        'manage:pages',
        'create:pageActions',
        'delete:pages',
      ],
    },
  },
  appsmith: {
    user: {
      email: 'liuleiytu@gmail.com',
      workspaceIds: ['63a210adcb0c41354d0ff121'],
      username: 'liuleiytu@gmail.com',
      name: 'Lei Liu',
      role: 'engineer',
      useCase: 'personal project',
      enableTelemetry: false,
      idToken: {},
      emptyInstance: false,
      accountNonExpired: true,
      accountNonLocked: true,
      credentialsNonExpired: true,
      isAnonymous: false,
      isEnabled: true,
      isSuperUser: false,
      isConfigurable: true,
    },
    URL: {
      fullPath:
        'https://dev.appsmith.com/applications/63a210adcb0c41354d0ff122/pages/63a210adcb0c41354d0ff125/edit',
      host: 'dev.appsmith.com',
      hostname: 'dev.appsmith.com',
      queryParams: {},
      protocol: 'https:',
      pathname:
        '/applications/63a210adcb0c41354d0ff122/pages/63a210adcb0c41354d0ff125/edit',
      port: '',
      hash: '',
    },
    store: {},
    geolocation: {
      canBeRequested: true,
      currentPosition: {},
    },
    mode: 'EDIT',
    theme: {
      colors: {
        primaryColor: '#16a34a',
        backgroundColor: '#F6F6F6',
      },
      borderRadius: {
        appBorderRadius: '0px',
      },
      boxShadow: {
        appBoxShadow: 'none',
      },
      fontFamily: {
        appFont: 'System Default',
      },
    },
    ENTITY_TYPE: 'APPSMITH',
    __evaluation__: {
      errors: {
        'user.name': [],
        'theme.borderRadius.appBorderRadius': [],
        'theme.colors.primaryColor': [],
        user: [],
        'theme.borderRadius': [],
        'theme.colors': [],
        theme: [],
      },
    },
  },
}
