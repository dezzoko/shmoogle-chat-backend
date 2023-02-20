import { SetMetadata } from '@nestjs/common';

import { NO_AUTH } from '../constants/metatags';

export const NoAuth = () => SetMetadata(NO_AUTH, true);
