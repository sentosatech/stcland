CREATE SCHEMA IF NOT EXISTS core;

CREATE TABLE core.ORGANIZATIONS (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name varchar(100) NOT NULL,
    updated_at TIMESTAMP DEFAULT now(),
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE core.USERS (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE core.USERS_ORGANIZATIONS (
    USER_ID UUID,
    ORGANIZATION_ID UUID,
    PRIMARY KEY (USER_ID, ORGANIZATION_ID),
    FOREIGN KEY (USER_ID) REFERENCES core.USERS(id) ON DELETE CASCADE,
    FOREIGN KEY (ORGANIZATION_ID) REFERENCES core.ORGANIZATIONS(id) ON DELETE CASCADE
);

CREATE INDEX USERS_ORGANIZATIONS_USER_ID_IDX on core.USERS_ORGANIZATIONS (USER_ID ASC);

CREATE INDEX USERS_ORGANIZATIONS_ORGANIZATION_ID_IDX on core.USERS_ORGANIZATIONS (ORGANIZATION_ID ASC);

CREATE TABLE core.PLAYERS (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- This is nullable as not every PLAYER is an USER
    nickname VARCHAR(100) NOT NULL, -- Name to show for this player in-game
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT PLAYERS_USER_ID_FKEY FOREIGN KEY (USER_ID)
    REFERENCES core.USERS (ID)
);

CREATE INDEX PLAYERS_USER_ID_IDX ON core.PLAYERS (USER_ID ASC);

CREATE TYPE core.HAND_GROUP_TYPE AS ENUM (
    'SESSION',
    'HOMEWORK'
);

CREATE TABLE core.HAND_GROUPS (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_type core.hand_group_type,
    agent_id UUID NOT NULL, -- User who recorded the group
    updated_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT SESSIONS_AGENT_ID_FKEY FOREIGN KEY (AGENT_ID)
    REFERENCES core.USERS (ID)
);

CREATE INDEX HAND_GROUPS_AGENT_ID_IDX ON core.HAND_GROUPS (AGENT_ID ASC);

CREATE TABLE core.HANDS (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hand_group_id UUID,
    hand_number INTEGER NOT NULL, -- Sequential number of the hand in the session (e.g. 1st hand, 2nd hand)
    dealer_position INTEGER, -- Position of the dealer for this specific hand
    updated_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(hand_group_id, hand_number),

    CONSTRAINT HANDS_HAND_GROUP_ID_FKEY FOREIGN KEY (HAND_GROUP_ID)
    REFERENCES core.HAND_GROUPS (ID)
);

CREATE INDEX HANDS_HAND_GROUP_ID_IDX ON core.HANDS (HAND_GROUP_ID ASC);

CREATE TYPE core.HAND_RESULT AS ENUM (
    'WON',
    'LOST',
    'SPLIT'
);

CREATE TYPE core.TABLE_POSITION AS ENUM (
    'SB',   -- Small Blind
    'BB',   -- Big Blind
    'UTG',  -- Under the Gun
    'UTG+1',
    'UTG+2',
    'MP',   -- Middle Position
    'HJ',   -- Hijack
    'CO',   -- Cutoff
    'BTN'   -- Button
);

CREATE TYPE core.CARD AS ENUM (
  '2h', '2d', '2c', '2s',
  '3h', '3d', '3c', '3s',
  '4h', '4d', '4c', '4s',
  '5h', '5d', '5c', '5s',
  '6h', '6d', '6c', '6s',
  '7h', '7d', '7c', '7s',
  '8h', '8d', '8c', '8s',
  '9h', '9d', '9c', '9s',
  'Th', 'Td', 'Tc', 'Ts',
  'Jh', 'Jd', 'Jc', 'Js',
  'Qh', 'Qd', 'Qc', 'Qs',
  'Kh', 'Kd', 'Kc', 'Ks',
  'Ah', 'Ad', 'Ac', 'As'
);

CREATE TABLE core.HANDS_PLAYERS (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hand_id UUID NOT NULL,
    player_id UUID NOT NULL,
    position core.TABLE_POSITION, -- Rotating position in the hand
    hole_cards core.CARD[] DEFAULT NULL,
    result core.HAND_RESULT, -- Outcome of the hand for the player
    starting_stack NUMERIC(10,2),
    ending_stack NUMERIC(10,2),
    updated_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT HANDS_PLAYERS_HAND_ID_FKEY FOREIGN KEY (HAND_ID)
    REFERENCES core.HANDS (ID),

    CONSTRAINT HANDS_PLAYERS_PLAYER_ID_FKEY FOREIGN KEY (PLAYER_ID)
    REFERENCES core.PLAYERS (ID)
);

CREATE INDEX HANDS_PLAYERS_HAND_ID_IDX ON core.HANDS_PLAYERS (HAND_ID ASC);

CREATE INDEX HANDS_PLAYERS_PLAYER_ID_IDX ON core.HANDS_PLAYERS (PLAYER_ID ASC);

CREATE TYPE core.STREET AS ENUM (
    'PRE_FLOP',
    'FLOP',
    'TURN',
    'RIVER'
);

CREATE TYPE core.ACTION AS ENUM (
    'CHECK',
    'CALL',
    'BET',
    'RAISE',
    'FOLD'
);

CREATE TABLE core.HAND_ACTIONS (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hand_player_id UUID NOT NULL,
    action core.ACTION,
    street core.STREET,
    action_sequence INTEGER NOT NULL,
    is_all_in BOOLEAN,
    updated_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT HAND_ACTIONS_HAND_PLAYER_ID_FKEY FOREIGN KEY (HAND_PLAYER_ID)
    REFERENCES core.HANDS_PLAYERS (ID)
);

CREATE INDEX HAND_ACTIONS_HAND_PLAYER_ID_IDX ON core.HAND_ACTIONS (HAND_PLAYER_ID ASC);
