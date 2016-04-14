<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "resource_class".
 *
 * @property integer $class_id
 * @property string $name
 *
 * @property AttributeClassView[] $attributeClassViews
 * @property Resource[] $resources
 */
class ResourceClass extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'resource_class';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['name'], 'required'],
            [['name'], 'string', 'max' => 40]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'class_id' => 'Class ID',
            'name' => 'Name',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getAttributeClassViews()
    {
        return $this->hasMany(AttributeClassView::className(), ['class_id' => 'class_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getResources()
    {
        return $this->hasMany(Resource::className(), ['class_id' => 'class_id']);
    }
}
