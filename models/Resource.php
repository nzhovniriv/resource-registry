<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "resource".
 *
 * @property integer $resource_id
 * @property string $name
 * @property integer $owner_id
 * @property integer $class_id
 * @property string $coordinates
 * @property integer $coordinates_type_id
 * @property integer $owner_data_id
 *
 * @property Operation[] $operations
 * @property Parameter[] $parameters
 * @property CoordinatesType $coordinatesType
 * @property PersonalData $ownerData
 * @property ResourceClass $class
 */
class Resource extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'resource';
    }
    public function fields()
    {
    	return [
    			'resource_id',
    			'name',
    			'class' => function ($model) {
    				return $model->class->name;
    			},
				'parameters' => function($model){
					$parametersData = $model->parameters;
					foreach($parametersData as $parameter){
						$parameters[$parameter->getAttributeName($parameter->attribute_id)] = $parameter->value;
					}
					return $parameters;
				},
    			'coordinates',
                'reason',
    			'owner' => function ($model) {
    				return $model->ownerData;
    			},
                'date',
                'registrar' => function ($model) {
                    return $model->regData;
                },
                'registration_number'
    	];
    }
    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['class_id', 'owner_data_id', 'registrar_data_id'], 'integer'],
            [['coordinates'], 'string'],
            [['coords_center_lat'], 'number'],
            [['coords_center_lng'], 'number'],
            [['reason'], 'string'],
            [['name'], 'string', 'max' => 100],
            [['registration_number'], 'string', 'max' => 30],
            [['date'], 'string'],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'resource_id' => 'Resource ID',
            'name' => 'Name',
            'class_id' => 'Class ID',
            'coordinates' => 'Coordinates',
            'reason' => 'Reason',
            'owner_data_id' => 'Owner Data ID',
            'date' => 'date',
            'registrar_data_id' =>'registrar_data_id',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getOperations()
    {
        return $this->hasMany(Operation::className(), ['resource_id' => 'resource_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getParameters()
    {
        return $this->hasMany(Parameter::className(), ['resource_id' => 'resource_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getOwnerData()
    {
        return $this->hasOne(PersonalData::className(), ['personal_data_id' => 'owner_data_id']);
    }

    public function getRegData()
    {
        return $this->hasOne(PersonalData::className(), ['personal_data_id' => 'registrar_data_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getClass()
    {
        return $this->hasOne(ResourceClass::className(), ['class_id' => 'class_id']);
    }



}
