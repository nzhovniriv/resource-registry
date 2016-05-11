<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;

/**
 * This is the model class for table "community".
 *
 * @property integer $community_id
 * @property string $name
 * @property string $prefix
 * @property integer $commissioner_id
 * @property string $notes
 *
 * @property User $commissioner
 * @property User[] $users
 */
class Community extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'resource_coods';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['name', 'prefix'], 'required', 'string', 'max' => 50],
            [['notes'], 'string']
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'community_id' => 'Community ID',
            'name' => 'Name',
            'prefix' => 'Prefix',
            'notes' => 'Notes',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public static function findByCommunityName($com_name)
    {
        //find Community in DB by Name
        return static::findOne(['name' => $com_name]);
    }
}
