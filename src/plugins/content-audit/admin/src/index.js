import React from 'react';
import {
  prefixPluginTranslations,
  useCMEditViewDataManager,
} from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import {
  Card,
  CardBody,
  TableLabel,
  Divider,
  Text,
  Flex,
  Box,
} from '@strapi/design-system';


const pluginDescription = pluginPkg.strapi.description || pluginPkg.description;
const icon = pluginPkg.strapi.icon;
const name = pluginPkg.strapi.name;

export default {
  register(app) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: name,
      },
      Component: async () => {
        const component = await import(/* webpackChunkName: "[request]" */ './pages/App');

        return component;
      },
      permissions: [
        // Uncomment to set the permissions of the plugin here
        // {
        //   action: '', // the action name should be plugin::plugin-name.actionType
        //   subject: null,
        // },
      ],
    });
    app.registerPlugin({
      description: pluginDescription,
      icon,
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      isRequired: pluginPkg.strapi.required || false,
      name,
    });
  },

  bootstrap(app) {
    app.injectContentManagerComponent('editView', 'right-links', {
      name: 'content-audit-info',
      Component: () => {
        const {
          initialData,
          allLayoutData: { contentType: { attributes } },
        } = useCMEditViewDataManager();
                
        let fields = [];   

        for (let att in attributes) {
          for (let data in initialData) {
            if (att === data) {
              fields = [...fields, {
                name: att,
                type: attributes[att].type,
                value: initialData[data],
                required: attributes[att].required || false,
              }];
            }
          }
        }
        
        const totalFields = fields.length - 1;
        const requiredFields = fields.filter(field => field.required).length;
        const filledFields = fields.filter(field => field.value).length;
        console.log(totalFields, requiredFields, filledFields);

        return (
          <Card>
            <CardBody>
              <Box width="100%">
                <Box paddingBottom={3} paddingTop={4}>
                  <TableLabel textColor="neutral600">Completion plugin</TableLabel>
                </Box>
                <Divider />
                  <Flex justifyContent="space-between" paddingTop={2} paddingBottom={2}>
                    <Text textColor="neutral600">Completion rate</Text>
                    <Text>{Math.round((filledFields / totalFields) * 100)} %</Text>
                  </Flex>
                  <Flex justifyContent="space-between" paddingBottom={2}>
                    <Text textColor="neutral600">Total fields</Text>
                    <Text>{totalFields}</Text>
                  </Flex>
                  <Flex justifyContent="space-between" paddingBottom={2}>
                    <Text textColor="neutral600">Filled fields</Text>
                    <Text>{filledFields}</Text>
                  </Flex>
              </Box>
            </CardBody>
          </Card>
        );
      },
    });
  },

  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map(locale => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
