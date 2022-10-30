type Item = unknown;
const Item: BevyType<Item> = {
  typeName: "jumpy::item::Item",
};

type AnimatedSprite = {
  start: usize;
  end: usize;
  atlas: HandleTextureAtlas;
  flip_x: boolean;
  flip_y: boolean;
  repeat: boolean;
  fps: f32;
};
const AnimatedSprite: BevyType<AnimatedSprite> = {
  typeName: "jumpy::animation::AnimatedSprite",
};

type KinematicBody = {
  offset: Vec2;
  size: Vec2;
  velocity: Vec2;
  is_on_ground: boolean;
  was_on_ground: boolean;
  has_mass: boolean;
  has_friction: boolean;
  bouncyness: f32;
  is_deactivated: boolean;
  gravity: f32;
};
const KinematicBody: BevyType<KinematicBody> = {
  typeName: "jumpy::physics::KinematicBody",
};

type EntityName = [string];
const EntityName: BevyType<EntityName> = {
  typeName: "jumpy::name::EntityName",
};

const MapMeta: BevyType<unknown> = {
  typeName: "jumpy::metadata::map::MapMeta",
};

const initState: { swords: JsEntity[] } = {
  swords: [],
};
const state = ScriptInfo.state(initState);

export default {
  preUpdateInGame() {
    const mapQuery = world.query(MapMeta)[0];
    if (!mapQuery) {
      state.swords = [];
      return;
    }

    const spawnedEntities = MapElement.getSpawnedEntities();
    if (spawnedEntities.length > 0) {
      state.swords = [];
    }

    // Handle newly spawned map entities
    for (const spanwer_entity of spawnedEntities) {
      const [transform, global_transform, computed_visibility] = world
        .query(Transform, GlobalTransform, ComputedVisibility)
        .get(spanwer_entity);

      // Spawn a new entity for the sword and copy the transform and visibility from the map element
      const entity = world.spawn();
      state.swords.push(EntityRef.toJs(entity));

      world.insert(entity, Value.create(EntityName, ["Item: Sword"]));
      world.insert(entity, Value.create(Item));
      world.insert(entity, transform);
      world.insert(entity, global_transform);
      world.insert(entity, computed_visibility);
      world.insert(entity, Value.create(Visibility));

      // Add the animated sprite
      world.insert(
        entity,
        Value.create(AnimatedSprite, {
          start: 0,
          end: 0,
          repeat: false,
          fps: 0,
          atlas: {
            id: Assets.getHandleId("sword.atlas.yaml"),
          },
        })
      );

      // And the kinematic body
      world.insert(
        entity,
        Value.create(KinematicBody, {
          size: {
            x: 64,
            y: 16,
          },
          offset: {
            y: 38,
          },
          gravity: 1,
          has_friction: true,
          has_mass: true,
        })
      );
    }
  },

  updateInGame() {},
};